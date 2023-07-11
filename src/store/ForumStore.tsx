import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { auth, db } from "../firebase";
import authStore from "./AuthStore";

export interface Post {
  id?: string;
  title?: string;
  details?: string;
  author?: string | null;
  authorImage?: string | null;
  timestamp: number;
  isFavorite?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id?: string;
  postId: string;
  content: string;
  author?: string | null;
  authorImage?: string | null;
  timestamp: number;
}

class ForumStore {
  title: string = "";
  details: string = "";
  content: string = "";
  posts: Post[] = [];
  comments: Comment[] = [];
  userFavourites: Post[] = [];
  maxLength: number = 3000;
  errorMessage: string = "";

  constructor() {
    makeObservable(this, {
      title: observable,
      details: observable,
      posts: observable,
      maxLength: observable,
      errorMessage: observable,
      userFavourites: observable,
      setTitle: action.bound,
      setDetails: action.bound,
      setPosts: action.bound,
      setErrorMessage: action.bound,
      initializePosts: action.bound,
      markAsFavorite: action.bound,
      unmarkAsFavorite: action.bound,
      setUserFavourites: action.bound,
      getUserFavourites: action,
      handleFavorite: action,
    });

    this.initializePosts();
  }

  setTitle(title: string) {
    this.title = title;
  }

  setDetails(details: string) {
    this.details = details;
    if (details.length === this.maxLength) {
      this.setErrorMessage("Character count limit reached");
    } else {
      this.setErrorMessage("");
    }
  }

  setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
  }

  async initializePosts() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const updatedPosts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const { title, details, author, authorImage, timestamp, comments } = doc.data();
      const post: Post = {
        id: doc.id,
        title,
        details,
        author,
        authorImage,
        timestamp,
        comments
      };
      updatedPosts.push(post);
    });

    this.setPosts(updatedPosts);
  }

  setContent(content: string) {
    this.content = content;
    if (content.length === this.maxLength) {
      this.setErrorMessage("Character count limit reached");
    } else {
      this.setErrorMessage("");
    }
  }

  setComments(comments: Comment[]) {
    this.comments = comments;
  }

  async initializeComments(postId: string) {
    const querySnapshot = await getDocs(collection(db, "posts", postId, "comments"));
    const updatedComments: Comment[] = [];
    querySnapshot.forEach((doc) => {
      const { postId, content, author, authorImage, timestamp } = doc.data();
      const comments: Comment = {
        id: doc.id,
        postId: postId,
        content,
        author,
        authorImage,
        timestamp
      };
      updatedComments.push(comments);
    });

    this.setComments(updatedComments);
  }

  markAsFavorite(postId: string) {
    const updatedPosts = this.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isFavorite: true,
        };
      }
      return post;
    });
    this.setPosts(updatedPosts);
  }

  unmarkAsFavorite(postId: string) {
    const updatedPosts = this.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isFavorite: false,
        };
      }
      return post;
    });
    this.setPosts(updatedPosts);
  }

  setUserFavourites(userFavourites: Post[]) {
    this.userFavourites = userFavourites;
  }

  getUserFavourites = async () => {
    const querySnapshot = await getDocs(
      collection(db, "users", auth.currentUser!.uid, "favorites")
    );
    const data: Post[] = querySnapshot.docs.map((doc) => doc.data() as Post);
    this.setUserFavourites(data);
  };

  handleFavorite = async (postId: string) => {
    if (!auth.currentUser) {
      authStore.setAlert({
        open: true,
        message: "Please log in to access this feature",
        type: "error",
      });
      return;
    }

    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      if (post.isFavorite) {
        try {
          await deleteDoc(
            doc(db, "users", auth.currentUser!.uid, "favorites", postId)
          );
          this.unmarkAsFavorite(postId);
        } catch (error) {
          authStore.setAlert({
            open: true,
            message: "Unable to remove from favorites. Try again later",
            type: "error",
          });
        }
      } else {
        try {
          authStore.setAlert({
            open: true,
            message: "Post added to favourites",
            type: "success",
          });
          post.isFavorite = true;
          await setDoc(
            doc(db, "users", auth.currentUser!.uid, "favorites", postId),
            post
          );
          this.markAsFavorite(postId);
        } catch (error) {
          authStore.setAlert({
            open: true,
            message: "Unable to add to favorites. Try again later",
            type: "error",
          });
        }
      }
    }
  };
}

const forumStore = new ForumStore();

export default forumStore;
