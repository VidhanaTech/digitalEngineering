import { addUser } from "../actions/actions";
import apiClient from "../common/http-common";
import store from "../store";

async function addRewardPoints(
  Points,
  UserId,
  REWARDID,
  LOGUSER,
  ArticleId = null
) {
  if (UserId) {
    try {
      await apiClient
        .post("/user/addrewards", {
          points: Points || 0,
          userId: UserId,
          rewardId: REWARDID,
          logUserId: LOGUSER,
          articleId: ArticleId,
        })
        .then((res) => {
          if (res.data.user == "success") {
            if(UserId === LOGUSER && REWARDID !== 4 && REWARDID !== 5 ){  //(UserId === LOGUSER && rewardId !== rewardlist like id && rewardId !== rewardlist cmt id)
            let stateVal = store.getState().user;
            stateVal.RewardPoints = stateVal.RewardPoints + Points;
             store.dispatch(addUser(stateVal));
            }
            return true;
          }
          return true;
        })
        .catch(() => {
          return true;
        });
    } catch (error) {
      // Handle error here
      console.error("Error adding reward points:", error);
      return false;
    }
  }
}

export default addRewardPoints;
