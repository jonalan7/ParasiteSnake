/**
 * Parameters for creating a group
 * @param {string} name name group
 * @param {(array|string)} contactsId group contact
 */
export async function createGroup(name, contactsId) {
  const nameFunc = new Error().stack
    .match(/at (.*?) /)[1]
    .replace('Object.', '');
  if (typeof name !== 'string' || !name.length) {
    return API.scope(null, true, 404, 'enter the name variable as an string');
  }

  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  const chat = await Promise.all(contactsId.map((c) => API.sendExist(c)));
  const checkErro = chat.filter((e) => e.error === true)[0];

  if (checkErro && checkErro.status === 404) {
    if (!checkErro.error) {
      checkErro.error = true;
    }
    return checkErro;
  }

  const filterContact = chat.filter((c) => !c.error && c.isUser);

  try {
    const result = await window.Store.createGroup(
      name,
      undefined,
      undefined,
      filterContact
    );
    return API.scope(
      filterContact.id,
      false,
      result,
      'group created successfully',
      nameFunc,
      name
    );
  } catch {
    return API.scope(
      filterContact.id,
      true,
      400,
      'error creating group',
      nameFunc,
      name
    );
  }
}
