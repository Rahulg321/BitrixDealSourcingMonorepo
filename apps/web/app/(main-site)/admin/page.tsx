import React from "react";
import { auth } from "../../../auth";

export const metadata = {
  title: "Admin",
  description: "Welcome to admin page, only meant for admins",
};

const AdminPage = async () => {
  const session = await auth();

  return (
    <section className="container block-space">
      <div>
        <h1>Admin Panel</h1>
      </div>
    </section>
  );
};

export default AdminPage;
