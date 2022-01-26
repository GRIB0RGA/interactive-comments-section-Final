import * as data from "./data.json" assert { type: "json" };
import {
  commentSectionContainer,
  updateUI,
  renderCurrentUserCommentingSection,
} from "./components/scripts/renderFunctions.js";
import {
  storage,
  currentUserUsername,
  currentUserPictureWebp,
  postComment,
  replayFunc,
  deleteFunc,
  editFunc,
  upVotedownVote,
  modalCancelBtn,
  closeModal,
} from "./components/scripts/functionality.js";

/// FUNCTIONS FOR FUNCTIONALITY

// ? starting functions
updateUI(commentSectionContainer, storage, currentUserUsername);
// prettier-ignore
renderCurrentUserCommentingSection(currentUserPictureWebp,commentSectionContainer);

// ? functionality functions
postComment();
commentSectionContainer.addEventListener(`click`, replayFunc); //? replay
commentSectionContainer.addEventListener(`click`, deleteFunc); //? delete
commentSectionContainer.addEventListener(`click`, editFunc); //? edit
commentSectionContainer.addEventListener(`click`, upVotedownVote); //? vote

modalCancelBtn.addEventListener(`click`, closeModal);
