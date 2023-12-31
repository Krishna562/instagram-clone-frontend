import React, { useRef } from "react";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";
import {
  setCurrentUser,
  setIsSearchbarVisible,
} from "../../store/reducers/User/userReducer";
import { useNavigate } from "react-router-dom";

const SearchResult = ({ user, searchVal }) => {
  const { profilePic, username, followers } = user;

  const currentUser = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const crossBtnRef = useRef();

  const removeSearchHistory = async (userToRemoveId) => {
    try {
      const result = await axios.put("/update-history", {
        userId: userToRemoveId,
        actionType: "remove",
      });
      const updatedHistory = result.data.updatedHistory;
      dispatch(
        setCurrentUser({
          ...currentUser,
          searchHistory: updatedHistory.reverse(),
        })
      );
    } catch (err) {
      dispatch(setErr(err.response.data));
    }
  };

  return (
    <div
      className="searchbar__result"
      onClick={(e) => {
        if (crossBtnRef.current && crossBtnRef.current.contains(e.target))
          return;
        navigate(`/${username}`);
        dispatch(setIsSearchbarVisible(false));
      }}
    >
      <div className="result__left">
        <img src={profilePic || defaultProfilePic} alt="profile pic" />
        <div className="result__userInfo">
          <div className="result__username">{username}</div>
          <div className="result__status">
            {followers.length}{" "}
            {followers.length === 1 ? "follower" : "followers"}
          </div>
        </div>
      </div>
      {!searchVal && (
        <button
          ref={crossBtnRef}
          className="result__deleteBtn"
          onClick={() => {
            removeSearchHistory(user._id);
          }}
        >
          <AiOutlineClose />
        </button>
      )}
    </div>
  );
};

export default SearchResult;
