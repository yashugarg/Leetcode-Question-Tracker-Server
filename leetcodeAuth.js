import axios from "axios";

export class LeetcodeAuth {
  getCsrfToken = async (cookie) => {
    let csrftoken = "";
    const cookies = cookie[0].split(";");
    for (const message in cookies) {
      const msg = cookies[message];
      if (msg.startsWith("csrftoken")) {
        csrftoken = msg.split("=")[1];
        break;
      }
    }
    return csrftoken;
  };

  accessToken = async () => {
    const res = await axios.get("https://leetcode.com/", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Origin: "https://leetcode.com",
      },
      withCredentials: true,
      resolveWithFullResponse: true,
    });
    const token = await this.getCsrfToken(res.headers["set-cookie"]);
    return token;
  };

  getUserInfo = async (username, token, session) => {
    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
          query getUserProfile($username: String!) {
            allQuestionsCount {
              difficulty
              count
              __typename
            }
            matchedUser(username: $username) {
              username
              socialAccounts
              githubUrl
              contributions {
                points
                questionCount
                testcaseCount
                __typename
              }
              profile {
                realName
                websites
                countryName
                skillTags
                company
                school
                starRating
                aboutMe
                userAvatar
                reputation
                ranking
                __typename
              }
              submissionCalendar
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                  __typename
                }
                totalSubmissionNum {
                  difficulty
                  count
                  submissions
                  __typename
                }
                __typename
              }
              badges {
                id
                displayName
                icon
                creationDate
                medal {
                  slug
                  config {
                    icon
                    iconGif
                    iconGifBackground
                    iconWearing
                    __typename
                  }
                  __typename
                }
                __typename
              }
              upcomingBadges {
                name
                icon
                __typename
              }
              activeBadge {
                id
                __typename
              }
              __typename
            }
          }
        `,
        variables: {
          username: username,
        },
      },
      {
        headers: {
          authority: "leetcode.com",
          scheme: "https",
          cookie: "csrftoken=" + token + "; LEETCODE_SESSION=" + session,
          origin: "https://leetcode.com",
          referer: "https://leetcode.com/" + username,
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
          "x-csrftoken": token,
        },
        withCredentials: true,
      }
    );
    return res.data;
  };

  loginWithCredentials = async (username, password, token) => {
    const data = {
      login: username,
      password: password,
      csrfmiddlewaretoken: token,
    };

    const appCookies = { csrftoken: token };

    const resp = await axios.post(
      "https://leetcode.com/accounts/login/",
      data,
      {
        headers: {
          authority: "leetcode.com",
          scheme: "https",
          cookie: "csrftoken=" + token,
          origin: "https://leetcode.com",
          referer: "https://leetcode.com/accounts/login/",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
          "x-csrftoken": token,
          "x-requested-with": "XMLHttpRequest",
        },
        withCredentials: true,
      }
    );
    const respCookies = resp.headers["set-cookie"];
    const loginToken = getCsrfToken(respCookies);
    const sessionId = getSessionId(respCookies);
    console.log(loginToken);
  };
}
