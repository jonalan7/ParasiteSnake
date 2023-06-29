import {
  InterfaceHost,
  contact,
  InterfaceScope,
  checkNumber,
} from '../model/interface';

interface API {
  /**
   * Parameters to change group description
   */
  sendMessage: (to: string, body: String, options: object) => Promise<any>;
  /**
   * returns a list of contacts
   * @returns contacts
   */
  getAllContacts: () => Promise<contact>;
  /**
   * Add chat function
   */
  addChatWapi: () => void;
  /**
   * Creates a new chat group
   * @param groupName Group name
   * @param contacts Participants id '000000000000@c.us'
   */
  createGroup: (
    groupName: string,
    contacts: string | string[]
  ) => Promise<InterfaceScope>;
  /**
   * Add participant to Group
   * @param groupId Chat id ('0000000000-00000000@g.us' or '000000000000000000@g.us')
   * @param contacts Participants id '000000000000@c.us'
   */
  addParticipant: (
    groupId: string,
    contacts: string | string[]
  ) => Promise<InterfaceScope>;
  /**
   * Parameters to change group description
   * @param {string} groupId group number
   * @param {string} description group description
   */
  setGroupDescription: (
    groupId: string,
    description: string
  ) => Promise<InterfaceScope>;
  /**
   * Get information from the connected number
   * @returns Current host device details
   */
  getHost: () => Promise<InterfaceHost>;
  /**
   * Parameters to change group image
   * @param {string} groupId group number
   * @param {string} path of image
   */
  setGroupImage: (path: string | Object, to: string) => Promise<InterfaceScope>;
  /**
   * check if the number exists
   * @param {string} number phone number
   */
  checkNumberStatus: (number: string) => Promise<checkNumber>;
  /**
   * Set message information!
   * @param {object} msg mensagens
   */
  serializeMessageObj: (msg: object) => void;
}

declare global {
  interface Window {
    API: API;
    Store: any;
    interfaceChange: any;
    newMessage: any;
    newOnAck: any;
    serializeMessageObj: any;
  }
  const API: API;
}

export {};
