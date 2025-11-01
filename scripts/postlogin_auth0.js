
/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostUserRegistration = async (event, api) => {
  const userId = event.user.user_id;
  const userName = event.user.username ?? event.user.email ?? null;
  const email = event.user.email ?? null;
  const firstName = event.user.given_name ?? null;
  const lastName = event.user.family_name ?? null;
  const phone = event.user.phone_number ?? event.user.user_metadata?.phone ?? null;
  const address = event.user.user_metadata?.address ?? null;
  const image = event.user.picture ?? null;
  const birthday = event.user.user_metadata?.birthday ?? null;

  console.log("Newly Registered User:", JSON.stringify({
    userId,
    userName,
    email,
    firstName,
    lastName,
    phone,
    address,
    image,
    birthday
  }));

  const url = "https://mpm.ddns.net/users/if-not-exists";

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        userName,
        email,
        firstName,
        lastName,
        phone,
        address,
        image,
        birthday
      })
    });

    const data = await res.json();
    console.log("API response:", data);
  } catch (err) {
    console.error("Error calling user creation API:", err);
  }
};