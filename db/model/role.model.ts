import { model } from "mongoose";
import roleSchema from "../schema/role.schema";

// creates a Role class with methods for save() / findAll
const Role = model("Role",roleSchema);

export { Role };