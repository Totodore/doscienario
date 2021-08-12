import { DataModel } from "./default.model";
import { Blueprint } from "./sockets/blueprint-sock.model";
import { Tag } from "./sockets/tag-sock.model";
import { Document } from "../models/api/project.model";

export interface TagTree {
  primary: Tag;
  children: Tag[];
  els: (Document | Blueprint)[];
}