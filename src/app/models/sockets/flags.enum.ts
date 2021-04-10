export enum Flags {
  OPEN_DOC = "OPEN_DOC",
  SEND_DOC = "SEND_DOC",
  CLOSE_DOC = "CLOSE_DOC",
  WRITE_DOC = "WRITE_DOC",
  CURSOR_DOC = "CURSOR_DOC",
  REMOVE_DOC = "REMOVE_DOC",
  TAG_ADD_DOC = "TAG_ADD_DOC",
  TAG_REMOVE_DOC = "TAG_REMOVE_DOC",
  TAG_ALL_DOC = "TAG_ALL_DOC",
  RENAME_DOC = "RENAME_DOC",

  CREATE_TAG = "CREATE_TAG",
  REMOVE_TAG = "REMOVE_TAG",
  RENAME_TAG = "RENAME_TAG",
  COLOR_TAG = "COLOR_TAG",

  OPEN_PROJECT = "OPEN_PROJECT",
  CLOSE_PROJECT = "CLOSE_PROJECT",
  RENAME_PROJECT = "RENAME_PROJECT",
  ADD_USER_PROJECT = "ADD_USER_PROJECT",
  REMOVE_USER_PROJECT = "REMOVE_USER_PROJECT",

  RENAME_FILE = "RENAME_FILE",
  GET_FILE = "GET_FILE",
  CREATE_FILE = "CREATE_FILE",
  TAG_ADD_FILE = "TAG_ADD_FILE",
  TAG_REMOVE_FILE = "TAG_REMOVE_FILE",

  SEND_BLUEPRINT = "SEND_BLUEPRINT",
  OPEN_BLUEPRINT = "OPEN_BLUEPRINT",
  REMOVE_BLUEPRINT = "REMOVE_BLUEPRINT",
  RENAME_BLUEPRINT = "RENAME_BLUEPRINT",
  CLOSE_BLUEPRINT = "CLOSE_BLUEPRINT",
  CREATE_NODE = "CREATE_NODE",
  REMOVE_NODE = "REMOVE_NODE",
  PLACE_NODE = "PLACE_NODE",
  PLACE_RELATIONSHIP = "PLACE_RELATIONSHIP",
  CREATE_RELATION = "CREATE_RELATION",
  REMOVE_RELATION = "REMOVE_RELATION",
}
