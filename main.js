import { getTodos, deleteTodo, setId } from './api.js';
import { renderComments, replyToComment } from './render.js';
import { format } from "date-fns";


const loading = document.getElementById("loading");
const loadingForm = document.getElementById("loadingForm");
const addFormButtonElement = document.getElementById("add-form-button");
let quote = "";

let comments = [
];

loading.textContent = "Комментарии загружаются...";

export const fetchGet = () => {
  getTodos().then((responseData) => {
    // console.log(responseData.id)
    const appComments = responseData.comments.map((comment) => {
      // console.log(comment.id)
      return {
        name: comment.author.name,
        date: format(new Date(comment.date), 'yyyy-MM-dd hh.mm.ss'),
        text: comment.text,
        likes: 0,
        isLiked: false,
        changeButton: false,
        id: comment.id,
      }
    })
    loading.textContent = "";
    comments = appComments;
    renderAllComments();
  });
};

fetchGet();

const clickLike = () => {
  const likeButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', () => {
      likeButton.classList.add('-loading-like');
      function delay(interval = 300) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, interval);
        });
      };
      delay(2000).then(() => {
        const newLike = comments[likeButton.dataset.index];
        newLike.likes = newLike.isLiked
          ? newLike.likes - 1
          : newLike.likes + 1;
        newLike.isLiked = !newLike.isLiked;
        // newLike.isLikeLoading = false;
        renderAllComments();
      });
    })
  }
};

const clickDelete = () => {
  const deleteCommentButtons = document.querySelectorAll(".delete-comment-button");
  for (const deleteCommentButton of deleteCommentButtons) {
    deleteCommentButton.addEventListener('click', () => {
      let id = deleteCommentButton.dataset.id;
      console.log(id);
      deleteTodo({ id }).then(() => {
        fetchGet();
        renderAllComments();
      });
    })
  }
}

export const renderAllComments = () => {
  renderComments({ comments });
  clickLike();
  clickDelete();
  replyToComment();
  console.log('render');

}

renderAllComments();


