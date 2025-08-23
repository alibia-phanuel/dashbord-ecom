import { LogOut, Package, Layers, BarChart3, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

const items = [
  {
    title: "Statistiques",
    url: "/statistiques",
    icon: BarChart3,
  },
  {
    title: "Produits",
    url: "/produits",
    icon: Package,
  },
  {
    title: "Catégories",
    url: "/categories",
    icon: Layers,
  },
  {
    title: "Utilisateurs",
    url: "/utilisateurs",
    icon: Users,
  },
];

const user = {
  name: "Ben",
  email: "metabencoffrefort@gmail.com",
  avatar: "/avatar.jpg", // ✅ Met le chemin correct de l'avatar
};

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  return (
    <Sidebar className="flex flex-col justify-between h-full">
      <SidebarContent>
        {/* Sections principales */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer avec user */}
      <div className="p-4 border-t flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <LogOut className="h-5 w-5 text-red-500" />
          <span className="sr-only">Se déconnecter</span>
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Se déconnecter ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Êtes-vous sûr de vouloir vous déconnecter ? Cette action vous
            ramènera à l'écran de connexion.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)} // Ferme la modale
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                logout(); // Exécute la déconnexion
                setOpen(false); // Ferme la modale
              }}
            >
              Se déconnecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
