
/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
    const userId = event.user.user_id;
    const userName = event.user.username ?? event.user.email ?? null;
    const email = event.user.email ?? null;
  
    console.log("User Info:", JSON.stringify({ userId, userName, email }));
  
    const url = "https://mpm.ddns.net/users";
  
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          userName,
          email
        })
      });
  
      const data = await res.json();
      console.log("API response:", data);
    } catch (err) {
      console.error("Error calling user creation API:", err);
    }
  };