export interface InterfaceScope {
  to: to | string;
  error: boolean;
  text: string;
  status: string | id;
  type: string;
  body: string;
}

interface id {
  server: string;
  user: string;
  _serialized: string;
}

interface to {
  fromMe: boolean;
  remote: id;
  id: string;
  _serialized: string;
}
