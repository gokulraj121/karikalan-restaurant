
import { addToTakeawayOrder, getCurrentOrder } from "@/components/Takeaway";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MenuItem {
  name: string;
  description?: string;
  price: string;
  image?: string;
  vegetarian: boolean;
  featured?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
  subcategories?: {
    name: string;
    items: MenuItem[];
  }[];
}

const menuData: MenuCategory[] = [
  {
    id: "soups",
    name: "Soups",
    subcategories: [
      {
        name: "Veg",
        items: [
          { name: "Sweet Corn Soup", price: "₹110", vegetarian: true },
          { name: "Hot & Sour Soup (Veg)", price: "₹110", vegetarian: true },
          { name: "Clear Soup (Veg)", price: "₹110", vegetarian: true },
          { name: "Manchow Soup (Veg)", price: "₹110", vegetarian: true },
        ]
      },
      {
        name: "Non-Veg",
        items: [
          { name: "Hot & Sour Chicken Soup", price: "₹140", vegetarian: false },
          { name: "Hot & Sour Mutton Soup", price: "₹170", vegetarian: false },
          { name: "Clear Chicken Soup", price: "₹140", vegetarian: false },
          { name: "Clear Mutton Soup", price: "₹170", vegetarian: false },
          { name: "Manchow Chicken Soup", price: "₹140", vegetarian: false },
          { name: "Manchow Mutton Soup", price: "₹170", vegetarian: false },
          { name: "Mutton Bone Soup", price: "₹160", vegetarian: false },
          { name: "Nattu Kozhi Soup", price: "₹160", vegetarian: false },
          { name: "Karikalan SPL Crab Pepper Soup", price: "₹190", vegetarian: false, featured: true }
        ]
      }
    ],
    items: []
  },
  {
    id: "starters",
    name: "Starters",
    subcategories: [
      {
        name: "Veg",
        items: [
          { name: "Gobi Masala", price: "₹160", vegetarian: true },
          { name: "Gobi 65", price: "₹170", vegetarian: true },
          { name: "Gobi Manchurian", price: "₹170", vegetarian: true },
          { name: "Chilly Gobi", price: "₹170", vegetarian: true },
          { name: "Gobi Pepper Fry", price: "₹170", vegetarian: true },
          { name: "Aloo Tikka", price: "₹180", vegetarian: true },
          { name: "Mushroom 65", price: "₹180", vegetarian: true },
          { name: "Mushroom Manchurian", price: "₹200", vegetarian: true },
          { name: "Mushroom Hot Pepper", price: "₹200", vegetarian: true },
          { name: "Mushroom Salt and Pepper", price: "₹200", vegetarian: true },
          { name: "Mushroom Pallipalayam", price: "₹200", vegetarian: true },
          { name: "Paneer 65", price: "₹230", vegetarian: true, featured: true, image: "https://images.unsplash.com/photo-1563379091-1b7a2c200c32?q=80&w=500" },
          { name: "Chilly Paneer", price: "₹230", vegetarian: true },
          { name: "Paneer Manchurian", price: "₹230", vegetarian: true },
          { name: "Dragon Paneer", price: "₹230", vegetarian: true },
          { name: "Paneer Tikka", price: "₹250", vegetarian: true }
        ]
      },
      {
        name: "Egg",
        items: [
          { name: "Egg Full Boil", price: "₹50", vegetarian: false },
          { name: "Half Oil", price: "₹50", vegetarian: false },
          { name: "Egg Omelette", price: "₹50", vegetarian: false },
          { name: "Egg 65", price: "₹60", vegetarian: false },
          { name: "Egg Podimas/Burji", price: "₹80", vegetarian: false },
          { name: "Kalakki", price: "₹80", vegetarian: false },
          { name: "Special Kalakki", price: "₹120", vegetarian: false },
          { name: "Karikalan Special Chicken Omlette", price: "₹220", vegetarian: false },
          { name: "Karikalan Special Mutton Omlette", price: "₹260", vegetarian: false }
        ]
      },
      {
        name: "Chicken",
        items: [
          { name: "Chicken Leg 65 Dry/Manchurian (1 Pcs)", price: "₹120", vegetarian: false },
          { name: "Chicken Leg 65 Manchurian (1 Pcs)", price: "₹150", vegetarian: false },
          { name: "Karikalan SPL. Gun Chicken (1 Pcs)", price: "₹240", vegetarian: false },
          { name: "Chicken 65 (Boneless)", price: "₹270", vegetarian: false },
          { name: "Chicken Hot Pepper", price: "₹270", vegetarian: false },
          { name: "Chilli Chicken (Boneless)", price: "₹270", vegetarian: false },
          { name: "Dragon Chicken", price: "₹270", vegetarian: false },
          { name: "Ginger Chicken", price: "₹270", vegetarian: false },
          { name: "Honey Chicken", price: "₹270", vegetarian: false },
          { name: "Pepper Chicken", price: "₹270", vegetarian: false },
          { name: "Garlic Chicken", price: "₹270", vegetarian: false },
          { name: "Chicken 555/777", price: "₹270", vegetarian: false },
          { name: "Chicken Lollypop", price: "₹250", vegetarian: false },
          { name: "Chicken Lolly Pop Sausy/Manchurian", price: "₹270", vegetarian: false },
          { name: "Chicken Pallipalayam", price: "₹270", vegetarian: false },
          { name: "Andra Chicken", price: "₹280", vegetarian: false },
          { name: "Chicken Monika", price: "₹280", vegetarian: false },
          { name: "Chicken Sindhamani", price: "₹280", vegetarian: false },
          { name: "Honey Chilli Chicken", price: "₹280", vegetarian: false },
          { name: "Kerala Chicken", price: "₹280", vegetarian: false },
          { name: "Schezwan Chicken", price: "₹280", vegetarian: false },
          { name: "Maharaja Chicken", price: "₹290", vegetarian: false },
          { name: "Japan Chicken", price: "₹300", vegetarian: false },
          { name: "Karikalan SPL Gun Chicken", price: "₹300", vegetarian: false },
          { name: "Kasthuri Chicken", price: "₹300", vegetarian: false },
          { name: "Delhi Bheema Chicken", price: "₹300", vegetarian: false },
          { name: "Delhi Darbari Murgh Chicken", price: "₹300", vegetarian: false },
          { name: "Pusthani Chicken Curry", price: "₹300", vegetarian: false }
        ]
      },
      {
        name: "Mutton",
        items: [
          { name: "Mutton Boti", price: "₹230", vegetarian: false },
          { name: "Mutton Boti Pepper Fry", price: "₹230", vegetarian: false },
          { name: "Mutton Boti Egg Fry", price: "₹250", vegetarian: false },
          { name: "Mutton Sukka", price: "₹340", vegetarian: false },
          { name: "Mutton Pallipalayam", price: "₹340", vegetarian: false },
          { name: "Mutton Pepper Fry", price: "₹340", vegetarian: false },
          { name: "Mutton Varuval", price: "₹340", vegetarian: false },
          { name: "Karikalan Special Kasthuri Mutton (Oil Fried)", price: "₹370", vegetarian: false },
          { name: "Mutton Ghee Tawa Fry", price: "₹370", vegetarian: false },
          { name: "Mutton Bhuna Gosht", price: "₹370", vegetarian: false },
          { name: "Mutton Charsi Karahi", price: "₹370", vegetarian: false }
        ]
      },
      {
        name: "Sea Food",
        items: [
          { name: "Nethili 65", price: "₹200", vegetarian: false },
          { name: "Nethili Hot Pepper", price: "₹200", vegetarian: false },
          { name: "Fish 65 (Boneless)", price: "₹300", vegetarian: false },
          { name: "Chilly Fish", price: "₹300", vegetarian: false },
          { name: "Fish Hot Pepper", price: "₹300", vegetarian: false },
          { name: "Fish Finger", price: "₹330", vegetarian: false },
          { name: "Fish Manchurian", price: "₹330", vegetarian: false },
          { name: "Vanjaram Fish Fry", price: "₹330", vegetarian: false },
          { name: "Vanjaram Tawa Fry", price: "₹350", vegetarian: false },
          { name: "Karikalan SPL. Sizzler Fish", price: "On Date Price", vegetarian: false }
        ]
      },
      {
        name: "Prawn",
        items: [
          { name: "Prawn 65", price: "₹330", vegetarian: false },
          { name: "Prawn Manchurian", price: "₹330", vegetarian: false },
          { name: "Prawn Pepper Onion Fry", price: "₹330", vegetarian: false },
          { name: "Golden Fry Prawn", price: "₹350", vegetarian: false }
        ]
      },
      {
        name: "Kaadai",
        items: [
          { name: "Kaadai 65", price: "₹240", vegetarian: false },
          { name: "Kaadai Chettinadu", price: "₹250", vegetarian: false },
          { name: "Kaadai Pallipalayam", price: "₹250", vegetarian: false },
          { name: "Kaadai Pepper Fry", price: "₹240", vegetarian: false },
          { name: "Karikalan SPL. Pichi Potta Kaadai Pepper Fry", price: "₹250", vegetarian: false }
        ]
      },
      {
        name: "Country Chicken (Nattu Kozhi)",
        items: [
          { name: "Nattu Kozhi Pallipalayam", price: "₹350", vegetarian: false },
          { name: "Nattukozhi Chinthamani", price: "₹350", vegetarian: false },
          { name: "Nattukozhi Pepper Fry (Dry/Gravy)", price: "₹350", vegetarian: false },
          { name: "Nattukozhi Sukka", price: "₹350", vegetarian: false },
          { name: "Nattukozhi Tawa Fry (Dry)", price: "₹350", vegetarian: false },
          { name: "Karikalan SPL. Pichi Potta Nattu Kozhi Varuval", price: "₹380", vegetarian: false }
        ]
      }
    ],
    items: []
  },
  {
    id: "main-course",
    name: "Main Course",
    subcategories: [
      {
        name: "Veg Gravy",
        items: [
          { name: "Vegetable Kurma", price: "₹100", vegetarian: true },
          { name: "Vegetable Chetinad Gravy", price: "₹150", vegetarian: true },
          { name: "Green Peas Masala", price: "₹160", vegetarian: true },
          { name: "Karaikudi Kalan Curry", price: "₹170", vegetarian: true },
          { name: "Veg Kadai Masala", price: "₹170", vegetarian: true },
          { name: "Dal Fry", price: "₹170", vegetarian: true },
          { name: "Dal Makhani", price: "₹190", vegetarian: true },
          { name: "Dal Tadka", price: "₹190", vegetarian: true },
          { name: "Kadai Paneer", price: "₹200", vegetarian: true },
          { name: "Aloo Gobi Masala", price: "₹230", vegetarian: true },
          { name: "Paneer Butter Masala", price: "₹230", vegetarian: true, featured: true, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=500" },
          { name: "Sai Paneer", price: "₹230", vegetarian: true }
        ]
      },
      {
        name: "Egg Gravy",
        items: [
          { name: "Egg Masala", price: "₹160", vegetarian: false },
          { name: "Egg Chilli", price: "₹180", vegetarian: false },
          { name: "Egg Manchurian", price: "₹180", vegetarian: false }
        ]
      },
      {
        name: "Chicken Gravy",
        items: [
          { name: "Butter Chicken Masala", price: "₹270", vegetarian: false },
          { name: "Chicken Chettinad Masala", price: "₹270", vegetarian: false },
          { name: "Pepper Chicken Masala", price: "₹270", vegetarian: false },
          { name: "Hyderabadi Chicken Masala", price: "₹290", vegetarian: false },
          { name: "Muglai Chicken Masala", price: "₹290", vegetarian: false },
          { name: "Kadai Chicken Masala", price: "₹300", vegetarian: false },
          { name: "Karaikudi Chicken Masala", price: "₹320", vegetarian: false },
          { name: "Chicken Tikka Masala", price: "₹350", vegetarian: false }
        ]
      },
      {
        name: "Mutton Gravy",
        items: [
          { name: "Kudal Masala", price: "₹280", vegetarian: false },
          { name: "Mutton Chettinad Masala", price: "₹350", vegetarian: false },
          { name: "Mutton Kadai", price: "₹350", vegetarian: false },
          { name: "Mutton Kheema Curry", price: "₹350", vegetarian: false },
          { name: "Mutton Nalli Nihari (2 Pcs)", price: "₹350", vegetarian: false },
          { name: "Mutton Pepper Masala", price: "₹350", vegetarian: false },
          { name: "Mutton Rogan Josh", price: "₹370", vegetarian: false }
        ]
      },
      {
        name: "Country Chicken Gravy",
        items: [
          { name: "Karaikudi Nattukozhi", price: "₹310", vegetarian: false },
          { name: "Nattukozhi Pallipalayam", price: "₹310", vegetarian: false },
          { name: "Nattukozhi Pepper Masala", price: "₹310", vegetarian: false },
          { name: "Nattukozhi Chetinad Masala", price: "₹320", vegetarian: false }
        ]
      }
    ],
    items: []
  },
  {
    id: "biryani",
    name: "Biryani & Rice",
    subcategories: [
      {
        name: "Meals",
        items: [
          { name: "SPL Veg Meals", price: "₹160", vegetarian: true },
          { name: "Andhra Meals", price: "₹230", vegetarian: false },
          { name: "Fish Meals", price: "₹320", vegetarian: false },
          { name: "Chicken Meals", price: "₹300", vegetarian: false },
          { name: "Mutton Meals", price: "₹400", vegetarian: false },
          { name: "Nattu Kozhi Meals", price: "₹400", vegetarian: false },
          { name: "Karikalan SPL Meals - Non Veg", price: "₹450", vegetarian: false }
        ]
      },
      {
        name: "Veg Rice/Noodles",
        items: [
          { name: "Vegetable Fried Rice", price: "₹150", vegetarian: true },
          { name: "Vegetable Noodles", price: "₹150", vegetarian: true },
          { name: "Sezuwan Veg Fried Rice", price: "₹170", vegetarian: true },
          { name: "Sezuwan Veg Noodles", price: "₹170", vegetarian: true },
          { name: "Mushroom Fried Rice", price: "₹180", vegetarian: true },
          { name: "Mushroom Noodles", price: "₹180", vegetarian: true },
          { name: "Paneer Fried Rice", price: "₹200", vegetarian: true },
          { name: "Paneer Noodles", price: "₹200", vegetarian: true },
          { name: "Mixed Veg Noodles", price: "₹200", vegetarian: true }
        ]
      },
      {
        name: "Egg Biryani/Rice/Noodles",
        items: [
          { name: "Egg Fried Rice", price: "₹170", vegetarian: false },
          { name: "Egg Noodles", price: "₹170", vegetarian: false },
          { name: "Sezuwan Egg Fried Rice", price: "₹180", vegetarian: false },
          { name: "Sizuwan Egg Noodles", price: "₹180", vegetarian: false },
          { name: "Egg Biryani", price: "₹190", vegetarian: false }
        ]
      },
      {
        name: "Chicken Biryani/Rice/Noodles",
        items: [
          { name: "Chicken Biryani", price: "₹220", vegetarian: false, featured: true, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=500" },
          { name: "Chicken Fried Rice", price: "₹220", vegetarian: false },
          { name: "Chicken Noodles", price: "₹220", vegetarian: false },
          { name: "Sezuwan Chicken Fried Rice", price: "₹230", vegetarian: false },
          { name: "Sezuwan Chicken Noodles", price: "₹230", vegetarian: false },
          { name: "Chicken 65 Briyani", price: "₹260", vegetarian: false },
          { name: "Kebab Briyani", price: "₹280", vegetarian: false },
          { name: "Chicken Kothu Roast", price: "₹250", vegetarian: false }
        ]
      },
      {
        name: "Mutton Biryani/Rice/Noodles",
        items: [
          { name: "Mutton Biryani", price: "₹320", vegetarian: false }
        ]
      },
      {
        name: "Prawn Biryani/Rice/Noodles",
        items: [
          { name: "Prawn 65 Biryani", price: "₹270", vegetarian: false },
          { name: "Prawn Fried Rice", price: "₹270", vegetarian: false },
          { name: "Prawn Noodles", price: "₹270", vegetarian: false },
          { name: "Sezuwan Prawn Fried Rice", price: "₹280", vegetarian: false },
          { name: "Sezuwan Prawn Noodles", price: "₹280", vegetarian: false }
        ]
      },
      {
        name: "Mixed Non Veg Rice/Noodles",
        items: [
          { name: "Mixed Fried Rice Non Veg", price: "₹280", vegetarian: false },
          { name: "Mixed Noodles (Non Veg)", price: "₹280", vegetarian: false },
          { name: "Sezuwan Mixed Non Veg Noodles", price: "₹290", vegetarian: false }
        ]
      }
    ],
    items: []
  },
  {
    id: "tandoori",
    name: "Tandoori & Grill",
    subcategories: [
      {
        name: "Chicken",
        items: [
          { name: "Tandoori Chicken (Half)", price: "₹240", vegetarian: false },
          { name: "Tandoori Chicken (Quarter)", price: "₹130", vegetarian: false },
          { name: "Chicken Wings", price: "₹240", vegetarian: false },
          { name: "Grill Chicken (Half)", price: "₹260", vegetarian: false },
          { name: "Alfam Chicken (Half)", price: "₹270", vegetarian: false },
          { name: "Chicken Grill Alfam", price: "₹270", vegetarian: false },
          { name: "Chicken Tikka", price: "₹280", vegetarian: false },
          { name: "Murghu Malai Tikka Chicken", price: "₹300", vegetarian: false },
          { name: "Hariyali Kebab Chicken", price: "₹300", vegetarian: false },
          { name: "Reshmi Kebab Chicken", price: "₹310", vegetarian: false },
          { name: "Kali Mirchi Kebab Chicken", price: "₹320", vegetarian: false },
          { name: "Chicken Tangidi Kebab", price: "₹320", vegetarian: false },
          { name: "Karikalan SPL. Grill Chettinadu (Half) Chicken", price: "₹320", vegetarian: false },
          { name: "Karikalan SPL. Grill Pepper (Half) Chicken", price: "₹320", vegetarian: false },
          { name: "Afghani Kebab Chicken", price: "₹330", vegetarian: false },
          { name: "Tandoori Chicken (Full)", price: "₹480", vegetarian: false },
          { name: "Grill Chicken (Full)", price: "₹500", vegetarian: false },
          { name: "Alfam Chicken (Full)", price: "₹520", vegetarian: false },
          { name: "Tawa Murghu Chicken", price: "₹400", vegetarian: false },
          { name: "Chicken Sheek Kebab", price: "₹380", vegetarian: false },
          { name: "Karikalan Special Tandoori Chicken (Full)", price: "₹580", vegetarian: false },
          { name: "Karikalan Special Grill Chettinadu Chicken (Full)", price: "₹640", vegetarian: false }
        ]
      },
      {
        name: "Mutton",
        items: [
          { name: "Mutton Sheek Kebab", price: "₹380", vegetarian: false },
          { name: "Mutton Tikka", price: "₹380", vegetarian: false }
        ]
      },
      {
        name: "Fish",
        items: [
          { name: "Chilly Fish", price: "₹320", vegetarian: false },
          { name: "Fish Tikka", price: "₹320", vegetarian: false },
          { name: "Fish Plate", price: "₹340", vegetarian: false }
        ]
      }
    ],
    items: []
  },
  {
    id: "breads",
    name: "Breads",
    subcategories: [
      {
        name: "Indian Breads",
        items: [
          { name: "Idly 1 pcs", price: "₹15", vegetarian: true },
          { name: "Chappati (1 Pcs)", price: "₹35", vegetarian: true },
          { name: "Plain Naan", price: "₹60", vegetarian: true },
          { name: "Tandoori Roti", price: "₹60", vegetarian: true },
          { name: "Butter Roti", price: "₹70", vegetarian: true },
          { name: "Garlic Naan", price: "₹70", vegetarian: true },
          { name: "Kulcha", price: "₹70", vegetarian: true },
          { name: "Tandoori Parotha", price: "₹70", vegetarian: true },
          { name: "Lacha Paratha", price: "₹75", vegetarian: true },
          { name: "Aloo Paratha", price: "₹85", vegetarian: true },
          { name: "Methi Paratha", price: "₹85", vegetarian: true },
          { name: "Gobi Paratha", price: "₹90", vegetarian: true },
          { name: "Butter Naan", price: "₹70", vegetarian: true },
          { name: "Kashmiri Naan", price: "₹90", vegetarian: true },
          { name: "Kulcha Butter", price: "₹90", vegetarian: true },
          { name: "Parotha (1 Pcs)", price: "₹40", vegetarian: true },
          { name: "Veech Parotta (1 Pcs)", price: "₹60", vegetarian: true },
          { name: "Bun Parotha (1 Pcs)", price: "₹70", vegetarian: true },
          { name: "Ceylon Parotha (1 Pcs)", price: "₹80", vegetarian: true },
          { name: "Poricha Parotha (1 Pcs)", price: "₹80", vegetarian: true },
          { name: "Plain Roast", price: "₹90", vegetarian: true },
          { name: "Mutton Kothu Roast", price: "₹300", vegetarian: false },
          { name: "Egg Veechu Parotta (1 Pcs)", price: "₹90", vegetarian: false },
          { name: "Thoppi Roast", price: "₹100", vegetarian: true },
          { name: "Onion Uthappam", price: "₹110", vegetarian: true },
          { name: "Ghee Roast", price: "₹120", vegetarian: true },
          { name: "Onion Roast", price: "₹120", vegetarian: true },
          { name: "Podi Roast", price: "₹120", vegetarian: true },
          { name: "Egg Roast", price: "₹130", vegetarian: false },
          { name: "Karikalan Special Kushbhu Dosa", price: "₹130", vegetarian: true },
          { name: "Ceylon Egg Parotha (1 Pcs)", price: "₹140", vegetarian: false },
          { name: "Veg Kothu Parotha", price: "₹150", vegetarian: true },
          { name: "Egg Kothu Parotha", price: "₹180", vegetarian: false },
          { name: "Ceylon Chicken Parotha (1 Pcs)", price: "₹180", vegetarian: false },
          { name: "Chicken Kothu Parotha", price: "₹220", vegetarian: false },
          { name: "Ceylon Mutton Parotha (1 Pcs)", price: "₹240", vegetarian: false },
          { name: "Mutton Kothu Parotta", price: "₹280", vegetarian: false }
        ]
      }
    ],
    items: []
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      { name: "Gulab Jamun", price: "₹60", vegetarian: true },
      { name: "Carrot Halwa", price: "₹80", vegetarian: true },
      { name: "Gulab Jamun With Ice Cream", price: "₹150", vegetarian: true },
      { name: "Carrot Halwa With Ice Cream", price: "₹140", vegetarian: true },
      { name: "Bread Halwa", price: "₹120", vegetarian: true },
      { name: "Vennila/ Butter Scotch Scoop Ice creams-1 Scoop", price: "₹50", vegetarian: true },
      { name: "Vennila/ Butter Scotch Scoop Ice creams-2 Scoop", price: "₹80", vegetarian: true },
      { name: "Chocolate / Black Current Scoop Ice creams-1 Scoop", price: "₹80", vegetarian: true },
      { name: "Chocolate / Black Current Scoop Ice creams-2 Scoop", price: "₹130", vegetarian: true },
      { name: "Rasmalai", price: "₹169", vegetarian: true, image: "https://images.unsplash.com/photo-1606328003701-ccfbaf8ae8bf?q=80&w=500", featured: true }
    ]
  },
  {
    id: "beverages",
    name: "Beverages",
    subcategories: [
      {
        name: "Drinks",
        items: [
          { name: "Lime Juice", price: "₹65", vegetarian: true },
          { name: "Blue Mojito", price: "₹80", vegetarian: true },
          { name: "Green Apple Juice", price: "₹80", vegetarian: true },
          { name: "Mint Lemon Juice", price: "₹80", vegetarian: true },
          { name: "Strawberry Juice", price: "₹80", vegetarian: true },
          { name: "Lemon Soda", price: "₹80", vegetarian: true }
        ]
      },
      {
        name: "Milkshakes",
        items: [
          { name: "Milkshake", price: "₹100", vegetarian: true },
          { name: "Waffle Stick", price: "₹100", vegetarian: true },
          { name: "Chocolate Milkshake", price: "₹100", vegetarian: true },
          { name: "Butterscotch Milkshake", price: "₹120", vegetarian: true },
          { name: "Strawberry Milkshake", price: "₹120", vegetarian: true },
          { name: "Dairy Star", price: "₹140", vegetarian: true },
          { name: "Oreo Milkshake", price: "₹140", vegetarian: true },
          { name: "Black Current Milkshake", price: "₹150", vegetarian: true }
        ]
      },
      {
        name: "Salads",
        items: [
          { name: "Greeen Salad", price: "₹130", vegetarian: true },
          { name: "Veg Salad", price: "₹120", vegetarian: true },
          { name: "Carrot Salad", price: "₹120", vegetarian: true },
          { name: "Potato Salad", price: "₹120", vegetarian: true },
          { name: "Fruit Salad", price: "₹80", vegetarian: true },
          { name: "Fruit Salad With Ice Cream", price: "₹140", vegetarian: true }
        ]
      },
      {
        name: "Falooda",
        items: [
          { name: "Falooda", price: "₹180", vegetarian: true },
          { name: "Royal Falooda", price: "₹220", vegetarian: true }
        ]
      }
    ],
    items: []
  }
];

const Menu = () => {
  const [activeTab, setActiveTab] = useState("soups");
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartCount, setCartCount] = useState(0);

  // Update cart count when menu is loaded and when items are added
  useEffect(() => {
    // Get initial cart count
    const order = getCurrentOrder();
    const count = order.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);

    // Listen for changes to the order
    const handleOrderChange = () => {
      const order = getCurrentOrder();
      const count = order.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    // Add event listener for addToTakeaway events
    window.addEventListener('addToTakeaway', handleOrderChange);
    
    return () => {
      window.removeEventListener('addToTakeaway', handleOrderChange);
    };
  }, []);

  const handleQuantityChange = (itemName: string, action: 'increase' | 'decrease') => {
    setQuantities(prev => {
      const currentQty = prev[itemName] || 0;
      const newQty = action === 'increase' ? currentQty + 1 : Math.max(0, currentQty - 1);
      return { ...prev, [itemName]: newQty };
    });
  };

  const handleAddToTakeaway = (item: MenuItem) => {
    const itemKey = item.name;
    const quantity = quantities[itemKey] || 1;
    
    // Create a unique ID from the item name
    const itemId = itemKey.replace(/\s+/g, '-').toLowerCase();
    
    // Extract price value from the price string (e.g., "₹150" -> 150)
    const priceValue = parseInt(item.price.replace(/[^\d]/g, ''));
    
    // Add to takeaway with item name and price
    addToTakeawayOrder(itemId, quantity, item.name, priceValue);
    
    // Reset quantity
    setQuantities(prev => ({ ...prev, [itemKey]: 0 }));
    
    toast({
      title: "Added to Order",
      description: `${quantity}x ${item.name} added to your takeaway order`,
    });
  };

  // Function to directly add item with quantity 1
  const quickAddToCart = (item: MenuItem) => {
    // Create a unique ID from the item name
    const itemId = item.name.replace(/\s+/g, '-').toLowerCase();
    
    // Extract price value from the price string (e.g., "₹150" -> 150)
    const priceValue = parseInt(item.price.replace(/[^\d]/g, ''));
    
    // Add to takeaway with item name and price (quantity 1)
    addToTakeawayOrder(itemId, 1, item.name, priceValue);
    
    toast({
      title: "Added to Order",
      description: `1x ${item.name} added to your takeaway order`,
    });
  };

  // Function to render item with order details
  const renderItemWithOrder = (item: MenuItem) => {
    const itemKey = item.name;
    const quantity = quantities[itemKey] || 0;

    return (
      <Card className="bg-darkCard border border-gray-800 overflow-hidden hover:border-gold/50 transition-all duration-300">
        <div className="p-4 flex justify-between">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-playfair text-lg text-white">{item.name}</h4>
              <Badge
                variant="outline"
                className={`${
                  item.vegetarian ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
                } ml-2`}
              >
                {item.vegetarian ? "Veg" : "Non-Veg"}
              </Badge>
            </div>
            {item.description && <p className="text-gray-400 text-sm mb-2">{item.description}</p>}
            <p className="font-medium text-gold">{item.price}</p>
            
            {/* Add to Order controls */}
            <div className="mt-3 flex items-center">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 p-0 border-gray-600"
                onClick={() => handleQuantityChange(itemKey, 'decrease')}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="mx-2 text-white min-w-[30px] text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 p-0 border-gray-600"
                onClick={() => handleQuantityChange(itemKey, 'increase')}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button 
                variant="default"
                size="sm" 
                className="ml-4 bg-gold hover:bg-gold/80 text-darkBg"
                onClick={() => handleAddToTakeaway(item)}
                disabled={quantity === 0}
              >
                Add to Order
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-gold hover:bg-gold/10"
                onClick={() => quickAddToCart(item)}
                title="Quick add 1 to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {item.image && (
            <div className="ml-4 w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <section id="menu" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Menu</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our carefully curated menu featuring the finest ingredients and authentic flavors.
          </p>
          <div className="mt-4 inline-flex items-center bg-darkCard border border-gold/30 rounded-full px-4 py-2">
            <ShoppingCart className="text-gold mr-2 h-5 w-5" />
            <span className="text-white">Items in order: <span className="text-gold font-bold">{cartCount}</span></span>
          </div>
        </div>

        {/* Featured Items Slider */}
        <div className="mb-16">
          <h3 className="font-playfair text-2xl text-white mb-6">Chef's Specials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuData
              .flatMap(category => {
                if (category.items.length > 0) {
                  return category.items.filter(item => item.featured && item.image);
                } else if (category.subcategories) {
                  return category.subcategories.flatMap(
                    sub => sub.items.filter(item => item.featured && item.image)
                  );
                }
                return [];
              })
              .map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden bg-darkCard border border-gray-800 hover:border-gold/50 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-playfair text-lg text-white">{item.name}</h4>
                      <Badge
                        variant="outline"
                        className={`${
                          item.vegetarian ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
                        }`}
                      >
                        {item.vegetarian ? "Veg" : "Non-Veg"}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description || ""}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gold">{item.price}</p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-gold hover:bg-gold/80 text-darkBg"
                          onClick={() => quickAddToCart(item)}
                        >
                          Add to Order
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Full Menu */}
        <Tabs defaultValue="soups" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto no-scrollbar">
            <TabsList className="bg-darkCard border border-gray-800 p-1">
              {menuData.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-gold data-[state=active]:text-darkBg px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {menuData.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              {category.subcategories && category.subcategories.length > 0 ? (
                category.subcategories.map((subcategory, idx) => (
                  <div key={idx} className="mb-10">
                    <h4 className="text-xl font-playfair text-white mb-4 border-b border-gray-800 pb-2">
                      {subcategory.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subcategory.items.map((item, itemIdx) => (
                        <React.Fragment key={itemIdx}>
                          {renderItemWithOrder(item)}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item, index) => (
                    <React.Fragment key={index}>
                      {renderItemWithOrder(item)}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Menu;


