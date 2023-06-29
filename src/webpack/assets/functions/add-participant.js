/**
 * Parameters for adding a participant to the group
 * @param {string} groupId group number
 * @param {(Array| String)} contactsId contact number
 */
export async function addParticipant(groupId, contactsId) {
  const nameFunc = new Error().stack
    .match(/at (.*?) /)[1]
    .replace('Object.', '');
  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }
  const chatGroup = Store.Chat.get(groupId);
  if (!chatGroup) {
    return API.scope(null, true, 404, `group not found: ${groupId}`);
  }
  const contacts = await Promise.all(contactsId.map((c) => API.sendExist(c)));
  const checkErro = contacts.filter((e) => e.error === true)[0];

  if (checkErro && checkErro.status === 404) {
    if (!checkErro.error) {
      checkErro.error = true;
    }
    return checkErro;
  }

  try {
    await window.Store.Participants.addParticipants(chatGroup, contacts);
    return API.scope(
      groupId,
      false,
      200,
      `contact(s) successfully added!`,
      nameFunc,
      contacts.id
    );
  } catch {
    return API.scope(
      groupId,
      true,
      400,
      `could not add a participant`,
      nameFunc,
      contacts.id
    );
  }
}
