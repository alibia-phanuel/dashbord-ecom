import Layout from "@/Layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ShoppingCart, Boxes, Layers, PhoneCall } from "lucide-react";

export default function Statistique() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Bandeau de bienvenue */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bienvenue 👋, Admin</h1>
            <p className="text-muted-foreground">
              Voici un aperçu des statistiques de votre application.
            </p>
          </div>
          <Avatar>
            <AvatarImage src="/admin-avatar.png" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Employés",
              value: 12,
              icon: <Users className="w-6 h-6 text-blue-500" />,
            },
            {
              title: "Clients",
              value: 358,
              icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
            },
            {
              title: "Produits",
              value: 120,
              icon: <Boxes className="w-6 h-6 text-purple-500" />,
            },
            {
              title: "Catégories",
              value: 10,
              icon: <Layers className="w-6 h-6 text-orange-500" />,
            },
            {
              title: "Contacts",
              value: 45, // 📝 à remplacer par un nombre dynamique plus tard
              icon: <PhoneCall className="w-6 h-6 text-pink-500" />,
            },
          ].map((stat) => (
            <Card
              key={stat.title}
              className="transition-transform hover:scale-105 cursor-pointer"
            >
              <CardHeader className="flex items-center justify-between">
                <span className="font-medium">{stat.title}</span>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
