const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath);

  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contactsList = await listContacts();
  const contactWithId = contactsList.find(
    (contact) => contact.id === contactId
  );

  return contactWithId || null;
}

async function removeContact(contactId) {
  const allContacts = await listContacts();
  const removeIndex = allContacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (removeIndex === -1) {
    return null;
  }
  const [res] = allContacts.splice(removeIndex, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return res;
}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0);

  const newContact = {
    id: randomNumber,
    name,
    email,
    phone,
  };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact;
}

const allFunctions = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

module.exports = allFunctions;
