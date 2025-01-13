import {
  InterfaceHost,
  InterfaceScope,
  Contact,
  CheckNumber,
  ReactionIntro,
} from '../webpack/model/interface';

import { ScreenshotOptions } from 'puppeteer';

export interface API {
  /**
   * Function to take a screenshot
   * @param options - Options for the screenshot
   */
  screenshot(
    options: Readonly<ScreenshotOptions> & {
      encoding: 'base64';
    }
  ): Promise<string>;
  /**
   * Send a message to a contact or group
   */
  sendMessage: (to: string, body: string, options: object) => Promise<any>;
  /**
   * Serialize a message object
   */
  serializeMessageObj: (msg: object) => Promise<void>;
  /**
   * Get the code for a phone number
   */
  getCodeForPhoneNumber: (PhoneNumber: string) => Promise<any>;
  /**
   * Function refresh code for phone number
   */
  refreshAltLinkingCode: () => Promise<any>;
  /**
   * Get the interface
   */
  getInterface: () => Promise<any>;
  /**
   * Returns a list of all contacts
   */
  getAllContacts: () => Promise<Contact>;
  /**
   * Get all chat groups
   */
  getAllChatsGroups: () => Promise<any>;
  /**
   * Get group participants
   */
  getGroupParticipant: (groupId: string) => Promise<any>;
  /**
   * Creates a new chat group
   */
  createGroup: (
    groupName: string,
    contacts: string | string[]
  ) => Promise<InterfaceScope>;
  /**
   * Add participants to a group
   */
  addParticipant: (
    groupId: string,
    contacts: string | string[]
  ) => Promise<InterfaceScope>;
  /**
   * Set the group description
   */
  setGroupDescription: (
    groupId: string,
    description: string
  ) => Promise<InterfaceScope>;
  /**
   * Set the group image
   */
  setGroupImage: (path: object, to: string) => Promise<InterfaceScope>;
  /**
   * Get information about the connected number
   */
  getHost: () => Promise<InterfaceHost>;
  /**
   * Logout from WhatsApp Web
   */
  logoutSession: () => Promise<any>;
  /**
   * Check if a number exists
   */
  checkNumberStatus: (number: string) => Promise<CheckNumber>;
  /**
   * Get the current WhatsApp version
   */
  getWAVersion: () => Promise<string>;
  /**
   * Serialize reactions
   */
  serializeReactions: (
    emoji: object,
    collections: object,
    type: object
  ) => Promise<object[]>;
  /**
   * Serialize intro reactions
   */
  serializeIntroReactions: (
    emoji: object,
    type: object
  ) => Promise<ReactionIntro | []>;
  /**
   * Load and get all messages in a chat
   */
  loadAndGetAllMessagesInChat: (chatId: string, date: string) => Promise<any>;

  [key: string]: (...args: any[]) => any;
}

// Declaração global organizada
declare global {
  interface Window {
    API: API;
    Store: any;
    newOnAck: any;
    newMessage: any;
    newEditMessage: any;
    interfaceChange: any;
    newDeleteMessage: any;
    serializeMessageObj: any;
    onIntroReactionMessage: any;
    onReactionMessage: any;
    __debug: any;
  }

  const API: API;
}