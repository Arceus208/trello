import { OrganizationList } from "@clerk/nextjs";

const CreateOrganizazionPage = () => {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    ></OrganizationList>
  );
};

export default CreateOrganizazionPage;
