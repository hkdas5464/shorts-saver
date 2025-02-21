"use client";
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function MyNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      // Navigate to a dynamic page (e.g. /subtopic/[subtopic]) with the search query
      router.push(`/subtopic/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <Navbar isBordered className="px-4 py-2">
      <NavbarBrand>
        <h1 className="text-xl font-bold"></h1>
      </NavbarBrand>
      <NavbarContent justify="end">

        
                <NavbarItem justify="end" >
          
          <form onSubmit={handleSearchSubmit}  className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search subcategory..."
              value={searchQuery}
              classNames={{
                inputWrapper: "bg-default-200",
                sm:"w-full",
                input: "text-sm",
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
            >
              Search
            </Button>
          </form>
        </NavbarItem>
      </NavbarContent>
   
    </Navbar>
  );
}
