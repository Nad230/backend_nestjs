import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserLocationDto } from './dto/create-user-location.dto';

interface PlaceDetails {
    contact?: any;
    accommodation?: any;
    stars?: number;
    operator?: string;
    brand?: string;
  }
  
  interface Place {
    name: string;
    address: string;
    street: string;
    city: string;
    country: string;
    coordinates: { longitude: number; latitude: number } | null;
    details: PlaceDetails;
  }
  
  export interface CategorizedPlaces {
    [key: string]: Place[];
    accommodation: Place[];
    educational: Place[];
    healthcare: Place[];
    cultural_tourism: Place[];
    commercial: Place[];
    catering: Place[];
    services: Place[];
    transportation: Place[];
    leisure: Place[];
    other: Place[];
  }
@Injectable()
export class UserlocationService {
     constructor(private readonly prisma: PrismaService) {}


     async  createUserLocation(data: CreateUserLocationDto,userId:string) {
        return await this.prisma.userLocation.create({
          data: {
            userId: userId,
            city: data.city,
            country: data.country,
            latitude: data.latitude,
            longitude: data.longitude,

            
          },
        });
      }


      async updateUserLocation(id: string, range:number) {
        return await this.prisma.userLocation.update({
          where: { id },
          data: {
            range,
          },
        });
      }
      async updateLocationBudget(id: string, budgetRange: number) {
        return await this.prisma.userLocation.update({
          where: { id },
          data: { BudgetRange: budgetRange },
        });
      }
      
      async getUserLocationByUserId(userId: string) {
        return await this.prisma.userLocation.findUnique({
          where: {
            userId,
          },
        });
      }


      async getUserRangeByUserId(userId: string) {
        return await this.prisma.userLocation.findUnique({
          where: {
            userId,
          },
          select: {
            range: true,
          },
        });
      }
      async getUserBudgetRangeByUserId(userId: string) {
        return await this.prisma.userLocation.findUnique({
          where: {
            userId,
          },
          select: {
            BudgetRange: true,
          },
        });
      }

      async getUserCityByUserId(userId: string) {
        return await this.prisma.userLocation.findUnique({
          where: {
            userId,
          },
          select: {
            city: true,
          },
        });
      }

      async getUserCountryByUserId(userId: string) {
        return await this.prisma.userLocation.findUnique({
          where: {
            userId,
          },
          select: {
            country: true,
          },
        });
      }
      

      async getNearbyPlaces(userId: string) {
        const location = await this.getUserLocationByUserId(userId);
        const userRange = await this.getUserRangeByUserId(userId);
        const radius = userRange?.range; 
                      if (!location) {
          throw new NotFoundException('User location not found');
        }
      
        const { latitude, longitude } = location;
        const apiKey = process.env.GEOAPIFY_API_KEY;
      
        const groupedCategories = {
          catering: "catering.restaurant,catering.cafe,catering.fast_food",
          commercial: "commercial.food_and_drink.bakery,commercial.supermarket,commercial.clothing.clothes,commercial.books,commercial.houseware_and_hardware.doityourself",
          services: "service.beauty.hairdresser,service.beauty.spa,service.beauty.massage,service.cleaning.laundry,service.cleaning.dry_cleaning,service.taxi",
          healthcare: "healthcare.pharmacy,healthcare.hospital,healthcare.clinic_or_praxis.general",
          cultural: "entertainment.cinema,entertainment.museum,entertainment.zoo,tourism.sights",
          education: "education.school,education.university,education.library",
          accommodation: "accommodation.hotel,accommodation.guest_house",
          transport: "public_transport.bus,rental.car",
          leisure: "leisure.park,sport.fitness.fitness_centre",
        };
      
        const allResults: any[] = [];
      
        for (const categoryGroup in groupedCategories) {
          const categoryString = groupedCategories[categoryGroup];
          const url = `https://api.geoapify.com/v2/places?categories=${categoryString}&filter=circle:${longitude},${latitude},${radius}&limit=20&apiKey=${apiKey}`;
      
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.features) {
              allResults.push(...data.features);
            }
          } catch (error) {
            console.error(`Error fetching category group ${categoryGroup}:`, error);
          }
        }
      
        const categorizedPlaces = this.processCategorizedPlaces({ features: allResults });
        await this.saveNearbyPlaces(userId, categorizedPlaces);
        return categorizedPlaces;
      }
      
        
        // Function to process and categorize places
        private processCategorizedPlaces(data: any): CategorizedPlaces {
            const places: CategorizedPlaces = {
              accommodation: [],
              educational: [],
              healthcare: [],
              cultural_tourism: [],
              commercial: [],
              catering: [],
              services: [],
              transportation: [],
              leisure: [],
              other: [],
            };
        
          if (!data.features || !Array.isArray(data.features)) {
            return places;
          }
        
          data.features.forEach((feature: any) => {
            if (!feature.properties) return;
            
            const prop = feature.properties;
            const categories = prop.categories || [];
            const coords = feature.geometry?.coordinates;
            
            // Create a clean place object with essential info
            const place: Place = {
                name: prop.name || "Unnamed",
                address: prop.formatted || "",
                street: prop.street || "",
                city: prop.city || prop.county || prop.state || "",
                country: prop.country || "",
                coordinates: coords ? { longitude: coords[0], latitude: coords[1] } : null,
                details: {} as PlaceDetails // Type assertion here
              };
          
              // Now TypeScript knows about these properties
              if (prop.contact) place.details.contact = prop.contact;
              if (prop.accommodation) place.details.accommodation = prop.accommodation;
              if (prop.stars) place.details.stars = prop.stars;
              if (prop.operator) place.details.operator = prop.operator;
              if (prop.brand) place.details.brand = prop.brand;
            
            // Categorize based on the categories array
            if (categories.some(cat => cat.includes('accommodation'))) {
              places.accommodation.push(place);
            } else if (categories.some(cat => cat.includes('education'))) {
              places.educational.push(place);
            } else if (categories.some(cat => cat.includes('healthcare'))) {
              places.healthcare.push(place);
            } else if (categories.some(cat => 
              cat.includes('tourism') || cat.includes('entertainment.museum') || 
              cat.includes('tourism.sights'))) {
              places.cultural_tourism.push(place);
            } else if (categories.some(cat => cat.includes('commercial') || cat.includes('shop'))) {
              places.commercial.push(place);
            } else if (categories.some(cat => cat.includes('catering'))) {
              places.catering.push(place);
            } else if (categories.some(cat => cat.includes('service'))) {
              places.services.push(place);
            } else if (categories.some(cat => 
              cat.includes('transport') || cat.includes('rental') || cat.includes('taxi'))) {
              places.transportation.push(place);
            } else if (categories.some(cat => cat.includes('leisure') || cat.includes('sport'))) {
              places.leisure.push(place);
            } else {
              places.other.push(place);
            }
          });
          
          // Remove empty categories
          Object.keys(places).forEach(key => {
            if (places[key].length === 0) {
              delete places[key];
            }
          });
          
          return places;
        }



        async saveNearbyPlaces(userId: string, categorizedPlaces: CategorizedPlaces) {
            for (const [categoryName, places] of Object.entries(categorizedPlaces)) {
              // 1. Check or create category
              let category = await this.prisma.categoryPlace.findUnique({
                where: { name: categoryName },
              });
          
              if (!category) {
                category = await this.prisma.categoryPlace.create({
                  data: { name: categoryName },
                });
              }
          
              // 2. Loop through places
              for (const place of places) {
                const savedPlace = await this.prisma.place.create({
                  data: {
                    userId,
                    name: place.name,
                    address: place.address,
                    street: place.street || null,
                    city: place.city,
                    country: place.country,
                    latitude: place.coordinates?.latitude ?? 0,
                    longitude: place.coordinates?.longitude ?? 0,
                    categoryId: category.id,
                  },
                });
          
                // 3. Save details if available
                const contact = place.details?.contact || {};
                const operator = place.details?.operator || null;
                const brand = place.details?.brand || null;
                const stars = place.details?.accommodation?.stars ?? null;
          
                if (contact.phone || contact.email || operator || brand || stars !== null) {
                  await this.prisma.placeDetail.create({
                    data: {
                      placeId: savedPlace.id,
                      phone: contact.phone || null,
                      email: contact.email || null,
                      operator,
                      brand,
                      stars,
                    },
                  });
                }
              }
            }
          }


          async getPlaces(userId: string) {
            // Get all places for the user, including their category and details
            const places = await this.prisma.place.findMany({
              where: { userId },
              include: {
                category: true,
                details: true,
              },
            });
          
            // Group the places by their category name, same as in saveNearbyPlaces
            const categorizedPlaces: Record<string, any[]> = {};
          
            for (const place of places) {
              const categoryName = place.category.name;
          
              if (!categorizedPlaces[categoryName]) {
                categorizedPlaces[categoryName] = [];
              }
          
              categorizedPlaces[categoryName].push({
                name: place.name,
                address: place.address,
                street: place.street,
                city: place.city,
                country: place.country,
                coordinates: {
                  latitude: place.latitude,
                  longitude: place.longitude,
                },
                details: {
                  contact: {
                    phone: place.details?.phone || null,
                    email: place.details?.email || null,
                  },
                  operator: place.details?.operator || null,
                  brand: place.details?.brand || null,
                  accommodation: {
                    stars: place.details?.stars ?? null,
                  },
                },
              });
            }
          
            return categorizedPlaces;
          }
          


          
            
}

