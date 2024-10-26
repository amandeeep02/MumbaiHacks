// organization.manager.ts
import { Organization, IOrganization } from "./telegram.organization.model";
import { User } from "./telegram.user.model";

class OrganizationManager {
  async createOrganization(name: string, adminId: number): Promise<string> {
    try {
      const existingOrg = await Organization.findOne({ name });
      if (existingOrg) {
        return "Organization name already taken. Please choose a different name.";
      }

      const newOrg = new Organization({
        name,
        adminId,
        members: [{ chatId: adminId, role: "admin" }],
      });
      await newOrg.save();

      return `Organization "${name}" created successfully.`;
    } catch (error) {
      console.error("Error creating organization:", error);
      return "An error occurred while creating the organization. Please try again later.";
    }
  }

  async inviteMember(
    orgName: string,
    chatId: number,
    role: string
  ): Promise<string> {
    try {
      const org = await Organization.findOne({ name: orgName });
      if (!org) {
        return `Organization "${orgName}" does not exist.`;
      }

      if (org.members.some((member) => member.chatId === chatId)) {
        return "User is already a member of this organization.";
      }

      org.members.push({ chatId, role });
      await org.save();

      return `User invited to organization "${orgName}" as ${role}.`;
    } catch (error) {
      console.error("Error inviting member:", error);
      return "An error occurred while inviting the member. Please try again later.";
    }
  }

  async listMembers(orgName: string): Promise<string> {
    try {
      const org = await Organization.findOne({ name: orgName });
      if (!org) {
        return `Organization "${orgName}" does not exist.`;
      }

      const memberDetails = await Promise.all(
        org.members.map(async (member) => {
          const user = await User.findOne({ chatId: member.chatId });
          return `${user?.email || "Unknown User"} - ${member.role}`;
        })
      );

      return `Members of "${orgName}":\n${memberDetails.join("\n")}`;
    } catch (error) {
      console.error("Error listing members:", error);
      return "An error occurred while listing members. Please try again later.";
    }
  }
}

export { OrganizationManager };
