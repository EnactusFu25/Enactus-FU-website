import { systemRoles } from "../../utils/system-roles.js";



const endpointsRoles  = {
    manageUser: [systemRoles.HR, systemRoles.ADMIN, systemRoles.USER],
}

export default endpointsRoles