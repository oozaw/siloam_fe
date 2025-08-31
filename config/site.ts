export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Warehouse App",
  description: "A simple warehouse management app",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
