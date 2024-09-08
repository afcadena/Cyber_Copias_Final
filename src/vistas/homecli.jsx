import React from 'react'
import Footer from './footer'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import { ChevronRight, LogOut, ShoppingCart, Tag, Grid, User, ShoppingBag, Search } from 'lucide-react'
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Logo from "../assets/images/Logo.png";

const HomePage = () => {
  const categories = [
    { name: "Tecnología", icon: "💻", image: "/placeholder.svg?height=200&width=200" },
    { name: "Mundo GZ", icon: "🎮", image: "/placeholder.svg?height=200&width=200" },
    { name: "Libros", icon: "📚", image: "/placeholder.svg?height=200&width=200" },
    { name: "Hogar", icon: "🏠", image: "/placeholder.svg?height=200&width=200" },
    { name: "Juguetería", icon: "🧸", image: "/placeholder.svg?height=200&width=200" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      <header className="flex items-center justify-between p-4 bg-background shadow-md">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
        <Link to="/home" className="text-xl font-bold">
          CyberCopias
        </Link>
      </div>
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar productos..." className="pl-8 w-full" />
        </div>
      </div>
      <nav className="flex items-center space-x-4">
        <Link to="#ofertas" className="text-foreground hover:text-primary">
          <Tag className="h-6 w-6" />
        </Link>
        <Link to="/catalogo" className="text-foreground hover:text-primary">
          <Grid className="h-6 w-6" />
        </Link>
        <Link to="/cuenta" className="text-foreground hover:text-primary">
          <User className="h-6 w-6" />
        </Link>
        <Link to="/carrito" className="text-foreground hover:text-primary">
          <ShoppingCart className="h-6 w-6" />
        </Link>
        <Link to="#" className="text-foreground hover:text-primary">
          <ShoppingBag className="h-6 w-6" />
        </Link>
        <Link to="#" className="text-foreground hover:text-primary">
          <LogOut className="h-6 w-6" />
        </Link>
      </nav>
    </header>

      {/* Hero Carousel */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Carousel 
          opts={{ align: "start", loop: true }} 
          plugins={[AutoPlay({ delay: 5000 })]}
          className="w-full"
        >
          <CarouselContent>
            {[1, 2, 3].map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-[20/7] items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{`Oferta ${index + 1}`}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Carrusel de Categorías */}
        <section className="bg-white py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Nuestras Categorías</h2>
            <Carousel 
              opts={{ align: "start", loop: true }} 
              plugins={[AutoPlay({ delay: 3000 })]}
            >
              <CarouselContent>
                {categories.map((category, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <img src={category.image} alt={category.name} className="w-32 h-32 object-cover mb-2" />
                        <h3 className="font-semibold text-center">{category.name}</h3>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Ofertas Especiales */}
        <section className="bg-gray-100 py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Ofertas Especiales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Oferta {index + 1}</h3>
                    <p>Descripción de la oferta...</p>
                    <Button className="mt-2">Ver más</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categoría Destacada */}
        <section className="bg-white py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-primary">TECNOLOGÍA</h2>
              <Button variant="link" className="text-primary">
                Ver todo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <Carousel 
              opts={{ align: "start", loop: true }} 
              plugins={[AutoPlay({ delay: 3000 })]}
            >
              <CarouselContent>
                {[1, 2, 3, 4, 5].map((_, productIndex) => (
                  <CarouselItem key={productIndex} className="md:basis-1/3 lg:basis-1/4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-200 rounded-md mb-2"></div>
                        <h4 className="font-semibold">Producto {productIndex + 1}</h4>
                        <p className="text-sm text-gray-500">$ 199.900</p>
                        <Button className="mt-2 w-full">Agregar al carrito</Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage