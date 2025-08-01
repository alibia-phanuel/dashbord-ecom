import {
  LogOut,
  Package,
  Users,
  Layers,
  Bot,
  Facebook,
  BarChart3,
  MessageSquare,
} from "lucide-react";
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
  {
    title: "Chatbot",
    url: "/chatbot",
    icon: Bot,
  },
  {
    title: "ID Produit Facebook",
    url: "/facebook-id",
    icon: Facebook,
  },

  {
    title: "Questions/Réponses auto",
    url: "/questions-auto",
    icon: MessageSquare,
  },
];

const user = {
  name: "Phanuel Alibia",
  email: "phanuel.alibia@gmail.com",
  avatar: "/avatar.jpg", // ✅ Met le chemin correct de l'avatar
};

export function AppSidebar() {
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span className="sr-only">Se déconnecter</span>
        </Button>
      </div>
    </Sidebar>
  );
}
