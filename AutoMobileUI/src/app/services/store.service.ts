import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  filter,
  BehaviorSubject,
  map,
  concatMap,
  switchMap,
  tap,
} from 'rxjs';
import { Product } from './../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private products: Product[] = [];
  private selectedLanguageSubject = new BehaviorSubject<string>('en');
  selectedLanguage$ = this.selectedLanguageSubject.asObservable();
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getAllProducts(limit = '12', sort = 'desc'): Observable<Product[]> {
    return this.selectedLanguage$.pipe(
      switchMap((language: any) => {
        console.log('Language:', language);
        if (language === 'en') {
          console.log('Inside if condition');
          return this.getEnglishProducts().pipe(
            map(products => {
              const specialCharsRegex = /[ñá]/i;
              let spanish = false;
              for (const product of products) {
                if (
                  specialCharsRegex.test(product.title) ||
                  specialCharsRegex.test(product.description)
                ) {
                  spanish = true;
                  break; // Exit loop early if any product contains special characters
                }
              }
              if (spanish) {
                return this.getEnglishProducts();
              } else {
                return products;
              }
            })
          );
        } else {
          console.log('Inside else condition');
          return this.getSpanishProducts();
        }
      }),
      tap((products:any) => {
        this.products = products;
        this.productsSubject.next(this.products);
      }),
      map(products => products.slice(0, parseInt(limit, 10))),
      map(filteredProducts => {
        if (sort === 'desc') {
          return filteredProducts.sort((a:any, b:any) => a.price - b.price);
        } else {
          return filteredProducts.sort((a:any, b:any) => b.price - a.price);
        }
      })
    );
  }
  

  updateItem(item: any): Observable<any> {
    return this.getAllProducts().pipe(
      concatMap(() => {
        const index = this.products.findIndex(
          (product) => product.id === item.id
        );
        if (index !== -1) {
          this.products[index] = item;
        } else {
          this.products.push(item);
          this.products.sort((a, b) => b.id - a.id);
          this.productsSubject.next(this.products);
        }
        return of(this.products);
      })
    );
  }

  addProducts(products: Product[]) {
    this.productsSubject.next(products);
  }

  setSelectedLanguage(language: string) {
    this.selectedLanguageSubject.next(language);
    this.getAllProducts().subscribe();
  }

  getEnglishProducts() {
    const products = [
      {
        id: 1,
        title: 'Bosch PrimeACTIVE 28in Beam Wiper Blade',
        price: 14,
        description:
          'The Bosch PrimeACTIVE 28in Beam Wiper Blade is a high-quality windshield wiper blade designed for optimal performance in various weather conditions. With its advanced beam design, it provides even pressure across the windshield, ensuring streak-free wiping. The 28-inch size makes it suitable for a wide range of vehicle models. Its durable construction and advanced rubber technology contribute to its longevity and effectiveness, keeping your windshield clear and visibility high for safer driving.',
        category: 'Blades',
        image: 'Bosch PrimeACTIVE 28in Beam Wiper Blade.png',
        rating: {
          rate: 4.8,
          count: 400,
        },
      },
      {
        id: 2,
        title: 'Curt Trailer Hitch 12091',
        price: 109,
        description:
          'The Curt Trailer Hitch 12091 is a heavy-duty towing accessory designed to be mounted onto vehicles, providing a sturdy connection point for towing trailers, campers, or other recreational vehicles. This Class 2 trailer hitch is specifically engineered for compatibility with certain vehicle models and offers a custom fit. It is constructed from high-strength steel to withstand the rigors of towing and features a durable powder coat finish to resist rust and corrosion. With its bolt-on installation process and included hardware, it offers convenience and reliability for towing needs, making it an essential addition for hauling loads safely and securely.',
        category: 'Trailer',
        image: 'Curt Trailer Hitch 12091.png',
        rating: {
          rate: 4.8,
          count: 319,
        },
      },
      {
        id: 3,
        title: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL',
        price: 109,
        description:
          'The Duralast Battery BCI Group Size 65 750 CCA (Cold Cranking Amps) 65-DL is a robust automotive battery designed to deliver reliable starting power for vehicles requiring Group Size 65 batteries. With a Cold Cranking Amps rating of 750, it provides ample power to start engines in various weather conditions, including cold temperatures. The Group Size 65 designation indicates its specific dimensions and terminal configuration, ensuring compatibility with vehicles that require this size of battery.',
        category: 'Battery',
        image: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL.png',
        rating: {
          rate: 2.9,
          count: 470,
        },
      },
      {
        id: 4,
        title: 'Duralast Brake Rotor 71937DL',
        price: 64,
        description:
          'The Duralast Brake Rotor 71937DL is a high-quality replacement brake rotor designed for optimal braking performance and durability. Engineered to meet or exceed OEM specifications, this brake rotor is specifically designed to fit certain vehicle makes and models, ensuring a precise fit and reliable operation.',
        category: 'Brake',
        image: 'Duralast Brake Rotor 71937DL.png',
        rating: {
          rate: 3.3,
          count: 203,
        },
      },
      {
        id: 5,
        title: 'Duralast Ceramic Brake Pads MKD1021',
        price: 10.99,
        description:
          'The Duralast Ceramic Brake Pads MKD1021 are premium-quality brake pads designed to deliver reliable and consistent braking performance for a wide range of vehicles.',
        category: 'Brake Pads',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 1.9,
          count: 100,
        },
      },
      {
        id: 6,
        title: 'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L',
        price: 9.99,
        description:
          'The Duralast Suspension Strut and Coil Spring Assembly LS54-95111L offers a seamless solution for front suspension needs. Integrating both components into one unit, it ensures compatibility and easy installation. Engineered to meet or exceed OEM standards, it provides reliable performance and durability, absorbing shocks for a comfortable ride. Its quality construction materials guarantee longevity and resilience, making it ideal for various driving conditions. Easy to install and reliable in performance, it ensures a smooth and confident ride for drivers.',
        category: 'Suspension',
        image:
          'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L.png',
        rating: {
          rate: 3,
          count: 400,
        },
      },
      {
        id: 7,
        title: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz",
        price: 168,
        description:
          "Griot's Garage Heavy-Duty Wheel Cleaner 22oz is a powerful solution for effectively cleaning tough grime and brake dust from vehicle wheels. Specifically formulated to tackle heavy dirt buildup, this wheel cleaner is safe for use on various wheel finishes, including painted, chromed, and polished surfaces. Its advanced formula clings to the wheel surface, allowing for thorough cleaning without excessive scrubbing. The 22oz size provides ample product for multiple applications, making it a convenient choice for regular wheel maintenance. With Griot's Garage Heavy-Duty Wheel Cleaner, you can achieve sparkling clean wheels with minimal effort, enhancing the appearance of your vehicle.",
        category: 'Cleaner',
        image: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz.png",
        rating: {
          rate: 3.9,
          count: 70,
        },
      },
      {
        id: 8,
        title: 'K&N High Performance Air Intake System 63-3059',
        price: 695,
        description:
          "The K&N High Performance Air Intake System 63-3059 is an aftermarket upgrade designed to enhance engine performance and efficiency. This intake system replaces the factory air intake assembly with a high-flow, reusable air filter and custom-designed intake tubing. The result is improved airflow to the engine, allowing it to breathe more freely and potentially increasing horsepower and torque. Additionally, the K&N air filter is washable and reusable, meaning it can be cleaned and reinstalled, saving money on replacement filters over time. The 63-3059 intake system is engineered for specific vehicle applications, ensuring proper fitment and compatibility. With its easy installation process and potential performance gains, the K&N High Performance Air Intake System is a popular choice for automotive enthusiasts looking to upgrade their vehicle's intake system.",
        category: 'Air Intakers',
        image: 'K&N High Performance Air Intake System 63-3059.png',
        rating: {
          rate: 4.6,
          count: 400,
        },
      },
      {
        id: 9,
        title: 'STP Extended Life Oil Filter S10358XL',
        price: 15.99,
        description:
          'The STP Extended Life Oil Filter S10358XL is a high-quality oil filter designed to provide long-lasting engine protection and performance. Engineered with advanced filtration technology, it effectively captures and traps harmful contaminants such as dirt, debris, and metal particles, preventing them from circulating through the engine and causing damage. The extended life design means that this filter offers extended intervals between oil changes, reducing maintenance frequency and costs. Additionally, the S10358XL is built with durable materials to withstand the rigors of engine operation and ensure reliable filtration over its service life. With its precision engineering and superior filtration capabilities, the STP Extended Life Oil Filter S10358XL is a trusted choice for maintaining engine health and longevity.',
        category: 'Filter',
        image: 'STP Extended Life Oil Filter S10358XL.png',
        rating: {
          rate: 2.1,
          count: 430,
        },
      },
      {
        id: 10,
        title: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart',
        price: 55.99,
        description:
          'STP High Mileage Full Synthetic Engine Oil in 5W-20 5 Quart packaging is a premium motor oil specifically formulated for high-mileage vehicles. Crafted with advanced synthetic base oils and a tailored additive package, it offers exceptional protection and performance for engines with over 75,000 miles. The 5W-20 viscosity grade ensures excellent cold-start protection and optimal engine lubrication across a wide range of temperatures. This oil is designed to combat common issues in older engines, such as wear, leaks, and deposits, while also rejuvenating seals and gaskets to help prevent leaks. With its high-quality formulation, STP High Mileage Full Synthetic Engine Oil helps extend engine life, reduce oil consumption, and maintain performance, making it an ideal choice for drivers seeking to maximize the longevity and reliability of their vehicles.',
        category: 'Oils',
        image: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart.png',
        rating: {
          rate: 4.7,
          count: 500,
        },
      },
      {
        id: 11,
        title: 'Valucraft Lawn & Garden Battery CCA 190A U1-145',
        price: 22.3,
        description:
          "The Valucraft Lawn & Garden Battery with CCA (Cold Cranking Amps) rating of 190A and model U1-145 is a reliable power source designed specifically for lawn and garden equipment. With its compact size and durable construction, this battery is ideal for powering lawn mowers, tractors, and other outdoor machinery. The 190A CCA rating ensures reliable starting power, even in cold weather conditions, making it suitable for year-round use. The U1-145 model designation indicates its specific size and terminal configuration, ensuring compatibility with a wide range of lawn and garden equipment. Whether you're mowing the lawn or tending to your garden, the Valucraft Lawn & Garden Battery provides the dependable performance you need to keep your equipment running smoothly.",
        category: 'Battery',
        image: 'Valucraft Lawn & Garden Battery CCA 190A U1-145.png',
        rating: {
          rate: 4.1,
          count: 259,
        },
      },
      {
        id: 12,
        title: 'Duralast Ceramic Brake Pads MKD1021',
        price: 109.95,
        description:
          "Duralast Ceramic Brake Pads MKD1021 offer premium braking performance with minimal noise and dust. Designed for various vehicle makes and models, these pads ensure consistent stopping power and durability. Their ceramic composition provides reliable performance in diverse driving conditions, making them an excellent choice for daily commutes or long trips. With Duralast's commitment to quality and longevity, MKD1021 pads deliver safe and smooth braking experiences, enhancing driver confidence on the road.",
        category: 'Battery',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
      {
        id: 13,
        title: 'Bosch PrimeACTIVE 28in Beam Wiper Blade',
        price: 14,
        description:
          'The Bosch PrimeACTIVE 28in Beam Wiper Blade is a high-quality windshield wiper blade designed for optimal performance in various weather conditions. With its advanced beam design, it provides even pressure across the windshield, ensuring streak-free wiping. The 28-inch size makes it suitable for a wide range of vehicle models. Its durable construction and advanced rubber technology contribute to its longevity and effectiveness, keeping your windshield clear and visibility high for safer driving.',
        category: 'Blades',
        image: 'Bosch PrimeACTIVE 28in Beam Wiper Blade.png',
        rating: {
          rate: 4.8,
          count: 400,
        },
      },
      {
        id: 14,
        title: 'Curt Trailer Hitch 12091',
        price: 109,
        description:
          'The Curt Trailer Hitch 12091 is a heavy-duty towing accessory designed to be mounted onto vehicles, providing a sturdy connection point for towing trailers, campers, or other recreational vehicles. This Class 2 trailer hitch is specifically engineered for compatibility with certain vehicle models and offers a custom fit. It is constructed from high-strength steel to withstand the rigors of towing and features a durable powder coat finish to resist rust and corrosion. With its bolt-on installation process and included hardware, it offers convenience and reliability for towing needs, making it an essential addition for hauling loads safely and securely.',
        category: 'Trailer',
        image: 'Curt Trailer Hitch 12091.png',
        rating: {
          rate: 4.8,
          count: 319,
        },
      },
      {
        id: 15,
        title: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL',
        price: 109,
        description:
          'The Duralast Battery BCI Group Size 65 750 CCA (Cold Cranking Amps) 65-DL is a robust automotive battery designed to deliver reliable starting power for vehicles requiring Group Size 65 batteries. With a Cold Cranking Amps rating of 750, it provides ample power to start engines in various weather conditions, including cold temperatures. The Group Size 65 designation indicates its specific dimensions and terminal configuration, ensuring compatibility with vehicles that require this size of battery.',
        category: 'Battery',
        image: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL.png',
        rating: {
          rate: 2.9,
          count: 470,
        },
      },
      {
        id: 15,
        title: 'Duralast Brake Rotor 71937DL',
        price: 64,
        description:
          'The Duralast Brake Rotor 71937DL is a high-quality replacement brake rotor designed for optimal braking performance and durability. Engineered to meet or exceed OEM specifications, this brake rotor is specifically designed to fit certain vehicle makes and models, ensuring a precise fit and reliable operation.',
        category: 'Brake',
        image: 'Duralast Brake Rotor 71937DL.png',
        rating: {
          rate: 3.3,
          count: 203,
        },
      },
      {
        id: 16,
        title: 'Duralast Ceramic Brake Pads MKD1021',
        price: 10.99,
        description:
          'The Duralast Ceramic Brake Pads MKD1021 are premium-quality brake pads designed to deliver reliable and consistent braking performance for a wide range of vehicles.',
        category: 'Brake Pads',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 1.9,
          count: 100,
        },
      },
      {
        id: 17,
        title: 'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L',
        price: 9.99,
        description:
          'The Duralast Suspension Strut and Coil Spring Assembly LS54-95111L offers a seamless solution for front suspension needs. Integrating both components into one unit, it ensures compatibility and easy installation. Engineered to meet or exceed OEM standards, it provides reliable performance and durability, absorbing shocks for a comfortable ride. Its quality construction materials guarantee longevity and resilience, making it ideal for various driving conditions. Easy to install and reliable in performance, it ensures a smooth and confident ride for drivers.',
        category: 'Suspension',
        image:
          'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L.png',
        rating: {
          rate: 3,
          count: 400,
        },
      },
      {
        id: 18,
        title: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz",
        price: 168,
        description:
          "Griot's Garage Heavy-Duty Wheel Cleaner 22oz is a powerful solution for effectively cleaning tough grime and brake dust from vehicle wheels. Specifically formulated to tackle heavy dirt buildup, this wheel cleaner is safe for use on various wheel finishes, including painted, chromed, and polished surfaces. Its advanced formula clings to the wheel surface, allowing for thorough cleaning without excessive scrubbing. The 22oz size provides ample product for multiple applications, making it a convenient choice for regular wheel maintenance. With Griot's Garage Heavy-Duty Wheel Cleaner, you can achieve sparkling clean wheels with minimal effort, enhancing the appearance of your vehicle.",
        category: 'Cleaner',
        image: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz.png",
        rating: {
          rate: 3.9,
          count: 70,
        },
      },
      {
        id: 19,
        title: 'K&N High Performance Air Intake System 63-3059',
        price: 695,
        description:
          "The K&N High Performance Air Intake System 63-3059 is an aftermarket upgrade designed to enhance engine performance and efficiency. This intake system replaces the factory air intake assembly with a high-flow, reusable air filter and custom-designed intake tubing. The result is improved airflow to the engine, allowing it to breathe more freely and potentially increasing horsepower and torque. Additionally, the K&N air filter is washable and reusable, meaning it can be cleaned and reinstalled, saving money on replacement filters over time. The 63-3059 intake system is engineered for specific vehicle applications, ensuring proper fitment and compatibility. With its easy installation process and potential performance gains, the K&N High Performance Air Intake System is a popular choice for automotive enthusiasts looking to upgrade their vehicle's intake system.",
        category: 'jewelery',
        image: 'K&N High Performance Air Intake System 63-3059.png',
        rating: {
          rate: 4.6,
          count: 400,
        },
      },
      {
        id: 20,
        title: 'STP Extended Life Oil Filter S10358XL',
        price: 15.99,
        description:
          'The STP Extended Life Oil Filter S10358XL is a high-quality oil filter designed to provide long-lasting engine protection and performance. Engineered with advanced filtration technology, it effectively captures and traps harmful contaminants such as dirt, debris, and metal particles, preventing them from circulating through the engine and causing damage. The extended life design means that this filter offers extended intervals between oil changes, reducing maintenance frequency and costs. Additionally, the S10358XL is built with durable materials to withstand the rigors of engine operation and ensure reliable filtration over its service life. With its precision engineering and superior filtration capabilities, the STP Extended Life Oil Filter S10358XL is a trusted choice for maintaining engine health and longevity.',
        category: 'Filter',
        image: 'STP Extended Life Oil Filter S10358XL.png',
        rating: {
          rate: 2.1,
          count: 430,
        },
      },
      {
        id: 21,
        title: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart',
        price: 55.99,
        description:
          'STP High Mileage Full Synthetic Engine Oil in 5W-20 5 Quart packaging is a premium motor oil specifically formulated for high-mileage vehicles. Crafted with advanced synthetic base oils and a tailored additive package, it offers exceptional protection and performance for engines with over 75,000 miles. The 5W-20 viscosity grade ensures excellent cold-start protection and optimal engine lubrication across a wide range of temperatures. This oil is designed to combat common issues in older engines, such as wear, leaks, and deposits, while also rejuvenating seals and gaskets to help prevent leaks. With its high-quality formulation, STP High Mileage Full Synthetic Engine Oil helps extend engine life, reduce oil consumption, and maintain performance, making it an ideal choice for drivers seeking to maximize the longevity and reliability of their vehicles.',
        category: 'Oils',
        image: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart.png',
        rating: {
          rate: 4.7,
          count: 500,
        },
      },
      {
        id: 22,
        title: 'Valucraft Lawn & Garden Battery CCA 190A U1-145',
        price: 22.3,
        description:
          "The Valucraft Lawn & Garden Battery with CCA (Cold Cranking Amps) rating of 190A and model U1-145 is a reliable power source designed specifically for lawn and garden equipment. With its compact size and durable construction, this battery is ideal for powering lawn mowers, tractors, and other outdoor machinery. The 190A CCA rating ensures reliable starting power, even in cold weather conditions, making it suitable for year-round use. The U1-145 model designation indicates its specific size and terminal configuration, ensuring compatibility with a wide range of lawn and garden equipment. Whether you're mowing the lawn or tending to your garden, the Valucraft Lawn & Garden Battery provides the dependable performance you need to keep your equipment running smoothly.",
        category: 'Battery',
        image: 'Valucraft Lawn & Garden Battery CCA 190A U1-145.png',
        rating: {
          rate: 4.1,
          count: 259,
        },
      },
      {
        id: 23,
        title: 'Duralast Ceramic Brake Pads MKD1021',
        price: 109.95,
        description:
          "Duralast Ceramic Brake Pads MKD1021 offer premium braking performance with minimal noise and dust. Designed for various vehicle makes and models, these pads ensure consistent stopping power and durability. Their ceramic composition provides reliable performance in diverse driving conditions, making them an excellent choice for daily commutes or long trips. With Duralast's commitment to quality and longevity, MKD1021 pads deliver safe and smooth braking experiences, enhancing driver confidence on the road.",
        category: 'Battery',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
      {
        id: 24,
        title: 'Bosch PrimeACTIVE 28in Beam Wiper Blade',
        price: 14,
        description:
          'The Bosch PrimeACTIVE 28in Beam Wiper Blade is a high-quality windshield wiper blade designed for optimal performance in various weather conditions. With its advanced beam design, it provides even pressure across the windshield, ensuring streak-free wiping. The 28-inch size makes it suitable for a wide range of vehicle models. Its durable construction and advanced rubber technology contribute to its longevity and effectiveness, keeping your windshield clear and visibility high for safer driving.',
        category: 'Blades',
        image: 'Bosch PrimeACTIVE 28in Beam Wiper Blade.png',
        rating: {
          rate: 4.8,
          count: 400,
        },
      },
      {
        id: 25,
        title: 'Curt Trailer Hitch 12091',
        price: 109,
        description:
          'The Curt Trailer Hitch 12091 is a heavy-duty towing accessory designed to be mounted onto vehicles, providing a sturdy connection point for towing trailers, campers, or other recreational vehicles. This Class 2 trailer hitch is specifically engineered for compatibility with certain vehicle models and offers a custom fit. It is constructed from high-strength steel to withstand the rigors of towing and features a durable powder coat finish to resist rust and corrosion. With its bolt-on installation process and included hardware, it offers convenience and reliability for towing needs, making it an essential addition for hauling loads safely and securely.',
        category: 'Trailer',
        image: 'Curt Trailer Hitch 12091.png',
        rating: {
          rate: 4.8,
          count: 319,
        },
      },
      {
        id: 26,
        title: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL',
        price: 109,
        description:
          'The Duralast Battery BCI Group Size 65 750 CCA (Cold Cranking Amps) 65-DL is a robust automotive battery designed to deliver reliable starting power for vehicles requiring Group Size 65 batteries. With a Cold Cranking Amps rating of 750, it provides ample power to start engines in various weather conditions, including cold temperatures. The Group Size 65 designation indicates its specific dimensions and terminal configuration, ensuring compatibility with vehicles that require this size of battery.',
        category: 'Battery',
        image: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL.png',
        rating: {
          rate: 2.9,
          count: 470,
        },
      },
      {
        id: 27,
        title: 'Duralast Brake Rotor 71937DL',
        price: 64,
        description:
          'The Duralast Brake Rotor 71937DL is a high-quality replacement brake rotor designed for optimal braking performance and durability. Engineered to meet or exceed OEM specifications, this brake rotor is specifically designed to fit certain vehicle makes and models, ensuring a precise fit and reliable operation.',
        category: 'Brake',
        image: 'Duralast Brake Rotor 71937DL.png',
        rating: {
          rate: 3.3,
          count: 203,
        },
      },
      {
        id: 28,
        title: 'Duralast Ceramic Brake Pads MKD1021',
        price: 10.99,
        description:
          'The Duralast Ceramic Brake Pads MKD1021 are premium-quality brake pads designed to deliver reliable and consistent braking performance for a wide range of vehicles.',
        category: 'Brake Pads',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 1.9,
          count: 100,
        },
      },
      {
        id: 29,
        title: 'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L',
        price: 9.99,
        description:
          'The Duralast Suspension Strut and Coil Spring Assembly LS54-95111L offers a seamless solution for front suspension needs. Integrating both components into one unit, it ensures compatibility and easy installation. Engineered to meet or exceed OEM standards, it provides reliable performance and durability, absorbing shocks for a comfortable ride. Its quality construction materials guarantee longevity and resilience, making it ideal for various driving conditions. Easy to install and reliable in performance, it ensures a smooth and confident ride for drivers.',
        category: 'Suspension',
        image:
          'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L.png',
        rating: {
          rate: 3,
          count: 400,
        },
      },
      {
        id: 30,
        title: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz",
        price: 168,
        description:
          "Griot's Garage Heavy-Duty Wheel Cleaner 22oz is a powerful solution for effectively cleaning tough grime and brake dust from vehicle wheels. Specifically formulated to tackle heavy dirt buildup, this wheel cleaner is safe for use on various wheel finishes, including painted, chromed, and polished surfaces. Its advanced formula clings to the wheel surface, allowing for thorough cleaning without excessive scrubbing. The 22oz size provides ample product for multiple applications, making it a convenient choice for regular wheel maintenance. With Griot's Garage Heavy-Duty Wheel Cleaner, you can achieve sparkling clean wheels with minimal effort, enhancing the appearance of your vehicle.",
        category: 'Cleaner',
        image: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz.png",
        rating: {
          rate: 3.9,
          count: 70,
        },
      },
      {
        id: 31,
        title: 'K&N High Performance Air Intake System 63-3059',
        price: 695,
        description:
          "The K&N High Performance Air Intake System 63-3059 is an aftermarket upgrade designed to enhance engine performance and efficiency. This intake system replaces the factory air intake assembly with a high-flow, reusable air filter and custom-designed intake tubing. The result is improved airflow to the engine, allowing it to breathe more freely and potentially increasing horsepower and torque. Additionally, the K&N air filter is washable and reusable, meaning it can be cleaned and reinstalled, saving money on replacement filters over time. The 63-3059 intake system is engineered for specific vehicle applications, ensuring proper fitment and compatibility. With its easy installation process and potential performance gains, the K&N High Performance Air Intake System is a popular choice for automotive enthusiasts looking to upgrade their vehicle's intake system.",
        category: 'jewelery',
        image: 'K&N High Performance Air Intake System 63-3059.png',
        rating: {
          rate: 4.6,
          count: 400,
        },
      },
      {
        id: 32,
        title: 'STP Extended Life Oil Filter S10358XL',
        price: 15.99,
        description:
          'The STP Extended Life Oil Filter S10358XL is a high-quality oil filter designed to provide long-lasting engine protection and performance. Engineered with advanced filtration technology, it effectively captures and traps harmful contaminants such as dirt, debris, and metal particles, preventing them from circulating through the engine and causing damage. The extended life design means that this filter offers extended intervals between oil changes, reducing maintenance frequency and costs. Additionally, the S10358XL is built with durable materials to withstand the rigors of engine operation and ensure reliable filtration over its service life. With its precision engineering and superior filtration capabilities, the STP Extended Life Oil Filter S10358XL is a trusted choice for maintaining engine health and longevity.',
        category: 'Filter',
        image: 'STP Extended Life Oil Filter S10358XL.png',
        rating: {
          rate: 2.1,
          count: 430,
        },
      },
      {
        id: 33,
        title: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart',
        price: 55.99,
        description:
          'STP High Mileage Full Synthetic Engine Oil in 5W-20 5 Quart packaging is a premium motor oil specifically formulated for high-mileage vehicles. Crafted with advanced synthetic base oils and a tailored additive package, it offers exceptional protection and performance for engines with over 75,000 miles. The 5W-20 viscosity grade ensures excellent cold-start protection and optimal engine lubrication across a wide range of temperatures. This oil is designed to combat common issues in older engines, such as wear, leaks, and deposits, while also rejuvenating seals and gaskets to help prevent leaks. With its high-quality formulation, STP High Mileage Full Synthetic Engine Oil helps extend engine life, reduce oil consumption, and maintain performance, making it an ideal choice for drivers seeking to maximize the longevity and reliability of their vehicles.',
        category: 'Oils',
        image: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart.png',
        rating: {
          rate: 4.7,
          count: 500,
        },
      },
      {
        id: 34,
        title: 'Valucraft Lawn & Garden Battery CCA 190A U1-145',
        price: 22.3,
        description:
          "The Valucraft Lawn & Garden Battery with CCA (Cold Cranking Amps) rating of 190A and model U1-145 is a reliable power source designed specifically for lawn and garden equipment. With its compact size and durable construction, this battery is ideal for powering lawn mowers, tractors, and other outdoor machinery. The 190A CCA rating ensures reliable starting power, even in cold weather conditions, making it suitable for year-round use. The U1-145 model designation indicates its specific size and terminal configuration, ensuring compatibility with a wide range of lawn and garden equipment. Whether you're mowing the lawn or tending to your garden, the Valucraft Lawn & Garden Battery provides the dependable performance you need to keep your equipment running smoothly.",
        category: 'Battery',
        image: 'Valucraft Lawn & Garden Battery CCA 190A U1-145.png',
        rating: {
          rate: 4.1,
          count: 259,
        },
      },
      {
        id: 35,
        title: 'Duralast Ceramic Brake Pads MKD1021',
        price: 109.95,
        description:
          "Duralast Ceramic Brake Pads MKD1021 offer premium braking performance with minimal noise and dust. Designed for various vehicle makes and models, these pads ensure consistent stopping power and durability. Their ceramic composition provides reliable performance in diverse driving conditions, making them an excellent choice for daily commutes or long trips. With Duralast's commitment to quality and longevity, MKD1021 pads deliver safe and smooth braking experiences, enhancing driver confidence on the road.",
        category: 'Battery',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
    ];

    return of(products);
  }

  getSpanishProducts() {
    const products = [
      {
        id: 1,
        title: 'Limpiaparabrisas Bosch PrimeACTIVE 28in Beam',
        price: 14,
        description:
          'El limpiaparabrisas Bosch PrimeACTIVE 28in Beam es una hoja de limpiaparabrisas de alta calidad diseñada para un rendimiento óptimo en diversas condiciones climáticas. Con su diseño avanzado de haz, proporciona presión uniforme en todo el parabrisas, garantizando un limpiado sin rayas.',
        category: 'Hoja de limpiaparabrisas',
        image: 'Bosch PrimeACTIVE 28in Beam Wiper Blade.png',
        rating: {
          rate: 4.8,
          count: 400,
        },
      },
      {
        id: 2,
        title: 'Enganche para remolque Curt 12091',
        price: 109,
        description:
          'El enganche para remolque Curt 12091 es un accesorio de remolque resistente diseñado para ser montado en vehículos, proporcionando un punto de conexión robusto para remolcar remolques, campistas u otros vehículos recreativos. Este enganche de remolque de Clase 2 está diseñado específicamente para ser compatible con ciertos modelos de vehículos y ofrece un ajuste personalizado. Está construido con acero de alta resistencia para resistir las rigurosidades del remolque y cuenta con un acabado de pintura en polvo duradero para resistir la oxidación y la corrosión. Con su proceso de instalación con pernos y hardware incluido, ofrece comodidad y confiabilidad para las necesidades de remolque, lo que lo convierte en una adición esencial para transportar cargas de manera segura y segura.',
        category: 'Remolque',
        image: 'Curt Trailer Hitch 12091.png',
        rating: {
          rate: 4.8,
          count: 319,
        },
      },
      {
        id: 3,
        title: 'Batería Duralast BCI Grupo Tamaño 65 750 CCA 65-DL',
        price: 109,
        description:
          'La batería Duralast BCI Grupo Tamaño 65 750 CCA (Amperios de Arranque en Frío) 65-DL es una batería automotriz robusta diseñada para proporcionar energía de arranque confiable para vehículos que requieren baterías de Grupo Tamaño 65. Con una calificación de Amperios de Arranque en Frío de 750, proporciona suficiente energía para arrancar motores en diversas condiciones climáticas, incluidas temperaturas frías. La designación de Grupo Tamaño 65 indica sus dimensiones y configuración de terminal específicas, garantizando la compatibilidad con vehículos que requieren este tamaño de batería.',
        category: 'Batería',
        image: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL.png',
        rating: {
          rate: 2.9,
          count: 470,
        },
      },
      {
        id: 4,
        title: 'Disco de freno Duralast 71937DL',
        price: 64,
        description:
          'El disco de freno Duralast 71937DL es un disco de freno de repuesto de alta calidad diseñado para un rendimiento de frenado óptimo y durabilidad. Diseñado para cumplir o superar las especificaciones OEM, este disco de freno está diseñado específicamente para adaptarse a ciertas marcas y modelos de vehículos, asegurando un ajuste preciso y un funcionamiento confiable.',
        category: 'Freno',
        image: 'Duralast Brake Rotor 71937DL.png',
        rating: {
          rate: 3.3,
          count: 203,
        },
      },
      {
        id: 5,
        title: 'Pastillas de freno cerámicas Duralast MKD1021',
        price: 10.99,
        description:
          'Las pastillas de freno cerámicas Duralast MKD1021 son pastillas de freno de alta calidad diseñadas para ofrecer un rendimiento de frenado confiable y constante para una amplia gama de vehículos.',
        category: 'Pastillas de freno',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 1.9,
          count: 100,
        },
      },
      {
        id: 6,
        title:
          'Ensamble de amortiguador de suspensión Duralast y muelle de bobina LS54-95111L',
        price: 9.99,
        description:
          'El Ensamble de amortiguador de suspensión Duralast y muelle de bobina LS54-95111L ofrece una solución perfecta para las necesidades de suspensión delantera. Integrando ambos componentes en una unidad, asegura compatibilidad e instalación fácil. Diseñado para cumplir o superar los estándares OEM, proporciona un rendimiento confiable y durabilidad, absorbiendo los golpes para un viaje cómodo. Sus materiales de construcción de calidad garantizan longevidad y resistencia, lo que lo hace ideal para diversas condiciones de conducción. Fácil de instalar y confiable en rendimiento, garantiza un viaje suave y seguro para los conductores.',
        category: 'Suspensión',
        image:
          'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L.png',
        rating: {
          rate: 3,
          count: 400,
        },
      },
      {
        id: 7,
        title: "Limpiador de ruedas de servicio pesado de Griot's Garage 22oz",
        price: 168,
        description:
          "El Limpiador de ruedas de servicio pesado de Griot's Garage 22oz es una solución potente para limpiar eficazmente la suciedad difícil y el polvo de frenos de las ruedas de los vehículos. Específicamente formulado para abordar la acumulación de suciedad pesada, este limpiador de ruedas es seguro para usar en varios acabados de ruedas, incluidas superficies pintadas, cromadas y pulidas. Su fórmula avanzada se adhiere a la superficie de la rueda, permitiendo una limpieza exhaustiva sin frotar excesivamente. El tamaño de 22 oz proporciona suficiente producto para múltiples aplicaciones, lo que lo convierte en una opción conveniente para el mantenimiento regular de las ruedas. Con el Limpiador de ruedas de servicio pesado de Griot's Garage, puede lograr ruedas limpias y relucientes con un esfuerzo mínimo, mejorando la apariencia de su vehículo.",
        category: 'Limpiador',
        image: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz.png",
        rating: {
          rate: 3.9,
          count: 70,
        },
      },
      {
        id: 8,
        title: 'Sistema de admisión de aire de alto rendimiento K&N 63-3059',
        price: 695,
        description:
          'El Sistema de admisión de aire de alto rendimiento K&N 63-3059 es una mejora de posventa diseñada para mejorar el rendimiento y la eficiencia del motor. Este sistema de admisión reemplaza el conjunto de admisión de aire de fábrica con un filtro de aire reutilizable de flujo alto y tuberías de admisión personalizadas. El resultado es un flujo de aire mejorado hacia el motor, lo que le permite respirar con más libertad y potencialmente aumentar la potencia y el par motor. Además, el filtro de aire K&N es lavable y reutilizable, lo que significa que se puede limpiar y reinstalar, ahorrando dinero en filtros de repuesto con el tiempo. El sistema de admisión 63-3059 está diseñado para aplicaciones de vehículos específicos, asegurando un ajuste y compatibilidad adecuados. Con su proceso de instalación fácil y posibles ganancias de rendimiento, el Sistema de admisión de aire de alto rendimiento K&N es una opción popular para los entusiastas del automóvil que buscan mejorar el sistema de admisión de su vehículo.',
        category: 'Admisión de aire',
        image: 'K&N High Performance Air Intake System 63-3059.png',
        rating: {
          rate: 4.6,
          count: 400,
        },
      },
      {
        id: 9,
        title: 'Filtro de aceite de vida extendida STP S10358XL',
        price: 15.99,
        description:
          'El Filtro de aceite de vida extendida STP S10358XL es un filtro de aceite de alta calidad diseñado para proporcionar protección y rendimiento del motor duraderos. Diseñado con tecnología de filtración avanzada, captura y atrapa eficazmente contaminantes dañinos como suciedad, escombros y partículas metálicas, evitando que circulen por el motor y causen daños. El diseño de vida extendida significa que este filtro ofrece intervalos prolongados entre cambios de aceite, reduciendo la frecuencia y los costos de mantenimiento. Además, el S10358XL está construido con materiales duraderos para resistir las rigurosidades de la operación del motor y garantizar una filtración confiable durante su vida útil. Con su ingeniería de precisión y capacidades de filtración superiores, el Filtro de aceite de vida extendida STP S10358XL es una opción confiable para mantener la salud y la longevidad del motor.',
        category: 'Filtro',
        image: 'STP Extended Life Oil Filter S10358XL.png',
        rating: {
          rate: 2.1,
          count: 430,
        },
      },
      {
        id: 10,
        title:
          'Aceite de motor sintético completo para alto kilometraje STP 5W-20 5 Quart',
        price: 55.99,
        description:
          'El aceite de motor sintético completo para alto kilometraje STP en envase de 5 cuartos en viscosidad 5W-20 es un aceite de motor premium formulado específicamente para vehículos con alto kilometraje. Elaborado con aceites base sintéticos avanzados y un paquete de aditivos adaptado, ofrece una protección y rendimiento excepcionales para motores con más de 75,000 millas. El grado de viscosidad 5W-20 garantiza una excelente protección en arranques en frío y una lubricación óptima del motor en una amplia gama de temperaturas. Este aceite está diseñado para combatir problemas comunes en motores más antiguos, como desgaste, fugas y depósitos, y también rejuvenece sellos y empaques para ayudar a prevenir fugas. Con su formulación de alta calidad, el aceite de motor sintético completo para alto kilometraje STP ayuda a prolongar la vida útil del motor, reducir el consumo de aceite y mantener el rendimiento, lo que lo convierte en una opción ideal para conductores que buscan maximizar la longevidad y la confiabilidad de sus vehículos.',
        category: 'Aceites',
        image: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart.png',
        rating: {
          rate: 4.7,
          count: 500,
        },
      },
      {
        id: 11,
        title: 'Batería para césped y jardín Valucraft CCA 190A U1-145',
        price: 22.3,
        description:
          'La batería para césped y jardín Valucraft con calificación CCA (Amperios de Arranque en Frío) de 190A y modelo U1-145 es una fuente de energía confiable diseñada específicamente para equipos de césped y jardín. Con su tamaño compacto y construcción duradera, esta batería es ideal para alimentar cortadoras de césped, tractores y otras maquinarias para exteriores. La calificación CCA de 190A garantiza una potencia de arranque confiable, incluso en condiciones climáticas frías, lo que la hace adecuada para uso durante todo el año. La designación del modelo U1-145 indica su tamaño específico y configuración de terminal, garantizando la compatibilidad con una amplia gama de equipos de césped y jardín. Ya sea que esté cortando el césped o cuidando su jardín, la batería para césped y jardín Valucraft proporciona el rendimiento confiable que necesita para mantener su equipo funcionando sin problemas.',
        category: 'Batería',
        image: 'Valucraft Lawn & Garden Battery CCA 190A U1-145.png',
        rating: {
          rate: 4.1,
          count: 259,
        },
      },
      {
        id: 12,
        title: 'Pastillas de freno cerámicas Duralast MKD1021',
        price: 109.95,
        description:
          'Las Pastillas de freno cerámicas Duralast MKD1021 ofrecen un rendimiento de frenado premium con un ruido y polvo mínimos. Diseñadas para diversos fabricantes y modelos de vehículos, estas pastillas garantizan una potencia de frenado constante y durabilidad. Su composición cerámica proporciona un rendimiento confiable en diversas condiciones de conducción, lo que las convierte en una excelente opción para viajes diarios o largos. Con el compromiso de Duralast con la calidad y la longevidad, las pastillas MKD1021 ofrecen experiencias de frenado seguras y suaves, mejorando la confianza del conductor en la carretera.',
        category: 'Batería',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
      {
        id: 13,
        title: 'Limpiaparabrisas Bosch PrimeACTIVE 28in Beam',
        price: 14,
        description:
          'El limpiaparabrisas Bosch PrimeACTIVE 28in Beam es una hoja de limpiaparabrisas de alta calidad diseñada para un rendimiento óptimo en diversas condiciones climáticas. Con su diseño avanzado de haz, proporciona presión uniforme en todo el parabrisas, garantizando un limpiado sin rayas. El tamaño de 28 pulgadas lo hace adecuado para una amplia gama de modelos de vehículos. Su construcción duradera y tecnología de goma avanzada contribuyen a su longevidad y efectividad, manteniendo su parabrisas claro y la visibilidad alta para una conducción más segura.',
        category: 'Hoja de limpiaparabrisas',
        image: 'Bosch PrimeACTIVE 28in Beam Wiper Blade.png',
        rating: {
          rate: 4.8,
          count: 400,
        },
      },
      {
        id: 14,
        title: 'Enganche para remolque Curt 12091',
        price: 109,
        description:
          'El enganche para remolque Curt 12091 es un accesorio de remolque resistente diseñado para ser montado en vehículos, proporcionando un punto de conexión robusto para remolcar remolques, campistas u otros vehículos recreativos. Este enganche de remolque de Clase 2 está diseñado específicamente para ser compatible con ciertos modelos de vehículos y ofrece un ajuste personalizado. Está construido con acero de alta resistencia para resistir las rigurosidades del remolque y cuenta con un acabado de pintura en polvo duradero para resistir la oxidación y la corrosión. Con su proceso de instalación con pernos y hardware incluido, ofrece comodidad y confiabilidad para las necesidades de remolque, lo que lo convierte en una adición esencial para transportar cargas de manera segura y segura.',
        category: 'Remolque',
        image: 'Curt Trailer Hitch 12091.png',
        rating: {
          rate: 4.8,
          count: 319,
        },
      },
      {
        id: 15,
        title: 'Batería Duralast BCI Grupo Tamaño 65 750 CCA 65-DL',
        price: 109,
        description:
          'La batería Duralast BCI Grupo Tamaño 65 750 CCA (Amperios de Arranque en Frío) 65-DL es una batería automotriz robusta diseñada para proporcionar energía de arranque confiable para vehículos que requieren baterías de Grupo Tamaño 65. Con una calificación de Amperios de Arranque en Frío de 750, proporciona suficiente energía para arrancar motores en diversas condiciones climáticas, incluidas temperaturas frías. La designación de Grupo Tamaño 65 indica sus dimensiones y configuración de terminal específicas, garantizando la compatibilidad con vehículos que requieren este tamaño de batería.',
        category: 'Batería',
        image: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL.png',
        rating: {
          rate: 2.9,
          count: 470,
        },
      },
      {
        id: 16,
        title: 'Disco de freno Duralast 71937DL',
        price: 64,
        description:
          'El disco de freno Duralast 71937DL es un disco de freno de repuesto de alta calidad diseñado para un rendimiento de frenado óptimo y durabilidad. Diseñado para cumplir o superar las especificaciones OEM, este disco de freno está diseñado específicamente para adaptarse a ciertas marcas y modelos de vehículos, asegurando un ajuste preciso y un funcionamiento confiable.',
        category: 'Freno',
        image: 'Duralast Brake Rotor 71937DL.png',
        rating: {
          rate: 3.3,
          count: 203,
        },
      },
      {
        id: 17,
        title: 'Pastillas de freno cerámicas Duralast MKD1021',
        price: 10.99,
        description:
          'Las pastillas de freno cerámicas Duralast MKD1021 son pastillas de freno de alta calidad diseñadas para ofrecer un rendimiento de frenado confiable y constante para una amplia gama de vehículos.',
        category: 'Pastillas de freno',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 1.9,
          count: 100,
        },
      },
      {
        id: 18,
        title:
          'Ensamble de amortiguador de suspensión Duralast y muelle de bobina LS54-95111L',
        price: 9.99,
        description:
          'El Ensamble de amortiguador de suspensión Duralast y muelle de bobina LS54-95111L ofrece una solución perfecta para las necesidades de suspensión delantera. Integrando ambos componentes en una unidad, asegura compatibilidad e instalación fácil. Diseñado para cumplir o superar los estándares OEM, proporciona un rendimiento confiable y durabilidad, absorbiendo los golpes para un viaje cómodo. Sus materiales de construcción de calidad garantizan longevidad y resistencia, lo que lo hace ideal para diversas condiciones de conducción. Fácil de instalar y confiable en rendimiento, garantiza un viaje suave y seguro para los conductores.',
        category: 'Suspensión',
        image:
          'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L.png',
        rating: {
          rate: 3,
          count: 400,
        },
      },
      {
        id: 19,
        title: "Limpiador de ruedas de servicio pesado de Griot's Garage 22oz",
        price: 168,
        description:
          "El Limpiador de ruedas de servicio pesado de Griot's Garage 22oz es una solución potente para limpiar eficazmente la suciedad difícil y el polvo de frenos de las ruedas de los vehículos. Específicamente formulado para abordar la acumulación de suciedad pesada, este limpiador de ruedas es seguro para usar en varios acabados de ruedas, incluidas superficies pintadas, cromadas y pulidas. Su fórmula avanzada se adhiere a la superficie de la rueda, permitiendo una limpieza exhaustiva sin frotar excesivamente. El tamaño de 22 oz proporciona suficiente producto para múltiples aplicaciones, lo que lo convierte en una opción conveniente para el mantenimiento regular de las ruedas. Con el Limpiador de ruedas de servicio pesado de Griot's Garage, puede lograr ruedas limpias y relucientes con un esfuerzo mínimo, mejorando la apariencia de su vehículo.",
        category: 'Limpiador',
        image: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz.png",
        rating: {
          rate: 3.9,
          count: 70,
        },
      },
      {
        id: 20,
        title: 'Sistema de admisión de aire de alto rendimiento K&N 63-3059',
        price: 695,
        description:
          'El Sistema de admisión de aire de alto rendimiento K&N 63-3059 es una mejora de posventa diseñada para mejorar el rendimiento y la eficiencia del motor. Este sistema de admisión reemplaza el conjunto de admisión de aire de fábrica con un filtro de aire reutilizable de flujo alto y tuberías de admisión personalizadas. El resultado es un flujo de aire mejorado hacia el motor, lo que le permite respirar con más libertad y potencialmente aumentar la potencia y el par motor. Además, el filtro de aire K&N es lavable y reutilizable, lo que significa que se puede limpiar y reinstalar, ahorrando dinero en filtros de repuesto con el tiempo. El sistema de admisión 63-3059 está diseñado para aplicaciones de vehículos específicos, asegurando un ajuste y compatibilidad adecuados. Con su proceso de instalación fácil y posibles ganancias de rendimiento, el Sistema de admisión de aire de alto rendimiento K&N es una opción popular para los entusiastas del automóvil que buscan mejorar el sistema de admisión de su vehículo.',
        category: 'Admisión de aire',
        image: 'K&N High Performance Air Intake System 63-3059.png',
        rating: {
          rate: 4.6,
          count: 400,
        },
      },
      {
        id: 21,
        title: 'Filtro de aceite de vida extendida STP S10358XL',
        price: 15.99,
        description:
          'El Filtro de aceite de vida extendida STP S10358XL es un filtro de aceite de alta calidad diseñado para proporcionar protección y rendimiento del motor duraderos. Diseñado con tecnología de filtración avanzada, captura y atrapa eficazmente contaminantes dañinos como suciedad, escombros y partículas metálicas, evitando que circulen por el motor y causen daños. El diseño de vida extendida significa que este filtro ofrece intervalos prolongados entre cambios de aceite, reduciendo la frecuencia y los costos de mantenimiento. Además, el S10358XL está construido con materiales duraderos para resistir las rigurosidades de la operación del motor y garantizar una filtración confiable durante su vida útil. Con su ingeniería de precisión y capacidades de filtración superiores, el Filtro de aceite de vida extendida STP S10358XL es una opción confiable para mantener la salud y la longevidad del motor.',
        category: 'Filtro',
        image: 'STP Extended Life Oil Filter S10358XL.png',
        rating: {
          rate: 2.1,
          count: 430,
        },
      },
      {
        id: 22,
        title:
          'Aceite de motor sintético completo para alto kilometraje STP 5W-20 5 Quart',
        price: 55.99,
        description:
          'El aceite de motor sintético completo para alto kilometraje STP en envase de 5 cuartos en viscosidad 5W-20 es un aceite de motor premium formulado específicamente para vehículos con alto kilometraje. Elaborado con aceites base sintéticos avanzados y un paquete de aditivos adaptado, ofrece una protección y rendimiento excepcionales para motores con más de 75,000 millas. El grado de viscosidad 5W-20 garantiza una excelente protección en arranques en frío y una lubricación óptima del motor en una amplia gama de temperaturas. Este aceite está diseñado para combatir problemas comunes en motores más antiguos, como desgaste, fugas y depósitos, y también rejuvenece sellos y empaques para ayudar a prevenir fugas. Con su formulación de alta calidad, el aceite de motor sintético completo para alto kilometraje STP ayuda a prolongar la vida útil del motor, reducir el consumo de aceite y mantener el rendimiento, lo que lo convierte en una opción ideal para conductores que buscan maximizar la longevidad y la confiabilidad de sus vehículos.',
        category: 'Aceites',
        image: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart.png',
        rating: {
          rate: 4.7,
          count: 500,
        },
      },
      {
        id: 23,
        title: 'Batería para césped y jardín Valucraft CCA 190A U1-145',
        price: 22.3,
        description:
          'La batería para césped y jardín Valucraft con calificación CCA (Amperios de Arranque en Frío) de 190A y modelo U1-145 es una fuente de energía confiable diseñada específicamente para equipos de césped y jardín. Con su tamaño compacto y construcción duradera, esta batería es ideal para alimentar cortadoras de césped, tractores y otras maquinarias para exteriores. La calificación CCA de 190A garantiza una potencia de arranque confiable, incluso en condiciones climáticas frías, lo que la hace adecuada para uso durante todo el año. La designación del modelo U1-145 indica su tamaño específico y configuración de terminal, garantizando la compatibilidad con una amplia gama de equipos de césped y jardín. Ya sea que esté cortando el césped o cuidando su jardín, la batería para césped y jardín Valucraft proporciona el rendimiento confiable que necesita para mantener su equipo funcionando sin problemas.',
        category: 'Batería',
        image: 'Valucraft Lawn & Garden Battery CCA 190A U1-145.png',
        rating: {
          rate: 4.1,
          count: 259,
        },
      },
      {
        id: 24,
        title: 'Pastillas de freno cerámicas Duralast MKD1021',
        price: 109.95,
        description:
          'Las Pastillas de freno cerámicas Duralast MKD1021 ofrecen un rendimiento de frenado premium con un ruido y polvo mínimos. Diseñadas para diversos fabricantes y modelos de vehículos, estas pastillas garantizan una potencia de frenado constante y durabilidad. Su composición cerámica proporciona un rendimiento confiable en diversas condiciones de conducción, lo que las convierte en una excelente opción para viajes diarios o largos. Con el compromiso de Duralast con la calidad y la longevidad, las pastillas MKD1021 ofrecen experiencias de frenado seguras y suaves, mejorando la confianza del conductor en la carretera.',
        category: 'Batería',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
      {
        id: 25,
        title: 'Limpiaparabrisas Bosch PrimeACTIVE 28in Beam',
        price: 14,
        description:
          'El limpiaparabrisas Bosch PrimeACTIVE 28in Beam es una hoja de limpiaparabrisas de alta calidad diseñada para un rendimiento óptimo en diversas condiciones climáticas. Con su diseño avanzado de haz, proporciona presión uniforme en todo el parabrisas, garantizando un limpiado sin rayas. El tamaño de 28 pulgadas lo hace adecuado para una amplia gama de modelos de vehículos. Su construcción duradera y tecnología de goma avanzada contribuyen a su longevidad y efectividad, manteniendo su parabrisas claro y la visibilidad alta para una conducción más segura.',
        category: 'Hoja de limpiaparabrisas',
        image: 'Bosch PrimeACTIVE 28in Beam Wiper Blade.png',
        rating: {
          rate: 4.8,
          count: 400,
        },
      },
      {
        id: 26,
        title: 'Enganche para remolque Curt 12091',
        price: 109,
        description:
          'El enganche para remolque Curt 12091 es un accesorio de remolque resistente diseñado para ser montado en vehículos, proporcionando un punto de conexión robusto para remolcar remolques, campistas u otros vehículos recreativos. Este enganche de remolque de Clase 2 está diseñado específicamente para ser compatible con ciertos modelos de vehículos y ofrece un ajuste personalizado. Está construido con acero de alta resistencia para resistir las rigurosidades del remolque y cuenta con un acabado de pintura en polvo duradero para resistir la oxidación y la corrosión. Con su proceso de instalación con pernos y hardware incluido, ofrece comodidad y confiabilidad para las necesidades de remolque, lo que lo convierte en una adición esencial para transportar cargas de manera segura y segura.',
        category: 'Remolque',
        image: 'Curt Trailer Hitch 12091.png',
        rating: {
          rate: 4.8,
          count: 319,
        },
      },
      {
        id: 27,
        title: 'Batería Duralast BCI Grupo Tamaño 65 750 CCA 65-DL',
        price: 109,
        description:
          'La batería Duralast BCI Grupo Tamaño 65 750 CCA (Amperios de Arranque en Frío) 65-DL es una batería automotriz robusta diseñada para proporcionar energía de arranque confiable para vehículos que requieren baterías de Grupo Tamaño 65. Con una calificación de Amperios de Arranque en Frío de 750, proporciona suficiente energía para arrancar motores en diversas condiciones climáticas, incluidas temperaturas frías. La designación de Grupo Tamaño 65 indica sus dimensiones y configuración de terminal específicas, garantizando la compatibilidad con vehículos que requieren este tamaño de batería.',
        category: 'Batería',
        image: 'Duralast Battery BCI Group Size 65 750 CCA 65-DL.png',
        rating: {
          rate: 2.9,
          count: 470,
        },
      },
      {
        id: 28,
        title: 'Disco de freno Duralast 71937DL',
        price: 64,
        description:
          'El disco de freno Duralast 71937DL es un disco de freno de repuesto de alta calidad diseñado para un rendimiento de frenado óptimo y durabilidad. Diseñado para cumplir o superar las especificaciones OEM, este disco de freno está diseñado específicamente para adaptarse a ciertas marcas y modelos de vehículos, asegurando un ajuste preciso y un funcionamiento confiable.',
        category: 'Freno',
        image: 'Duralast Brake Rotor 71937DL.png',
        rating: {
          rate: 3.3,
          count: 203,
        },
      },
      {
        id: 29,
        title: 'Pastillas de freno cerámicas Duralast MKD1021',
        price: 10.99,
        description:
          'Las pastillas de freno cerámicas Duralast MKD1021 son pastillas de freno de alta calidad diseñadas para ofrecer un rendimiento de frenado confiable y constante para una amplia gama de vehículos.',
        category: 'Pastillas de freno',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 1.9,
          count: 100,
        },
      },
      {
        id: 30,
        title:
          'Ensamble de amortiguador de suspensión Duralast y muelle de bobina LS54-95111L',
        price: 9.99,
        description:
          'El Ensamble de amortiguador de suspensión Duralast y muelle de bobina LS54-95111L ofrece una solución perfecta para las necesidades de suspensión delantera. Integrando ambos componentes en una unidad, asegura compatibilidad e instalación fácil. Diseñado para cumplir o superar los estándares OEM, proporciona un rendimiento confiable y durabilidad, absorbiendo los golpes para un viaje cómodo. Sus materiales de construcción de calidad garantizan longevidad y resistencia, lo que lo hace ideal para diversas condiciones de conducción. Fácil de instalar y confiable en rendimiento, garantiza un viaje suave y seguro para los conductores.',
        category: 'Suspensión',
        image:
          'Duralast Suspension Strut and Coil Spring Assembly LS54-95111L.png',
        rating: {
          rate: 3,
          count: 400,
        },
      },
      {
        id: 31,
        title: "Limpiador de ruedas de servicio pesado de Griot's Garage 22oz",
        price: 168,
        description:
          "El Limpiador de ruedas de servicio pesado de Griot's Garage 22oz es una solución potente para limpiar eficazmente la suciedad difícil y el polvo de frenos de las ruedas de los vehículos. Específicamente formulado para abordar la acumulación de suciedad pesada, este limpiador de ruedas es seguro para usar en varios acabados de ruedas, incluidas superficies pintadas, cromadas y pulidas. Su fórmula avanzada se adhiere a la superficie de la rueda, permitiendo una limpieza exhaustiva sin frotar excesivamente. El tamaño de 22 oz proporciona suficiente producto para múltiples aplicaciones, lo que lo convierte en una opción conveniente para el mantenimiento regular de las ruedas. Con el Limpiador de ruedas de servicio pesado de Griot's Garage, puede lograr ruedas limpias y relucientes con un esfuerzo mínimo, mejorando la apariencia de su vehículo.",
        category: 'Limpiador',
        image: "Griot's Garage Heavy-Duty Wheel Cleaner 22oz.png",
        rating: {
          rate: 3.9,
          count: 70,
        },
      },
      {
        id: 32,
        title: 'Sistema de admisión de aire de alto rendimiento K&N 63-3059',
        price: 695,
        description:
          'El Sistema de admisión de aire de alto rendimiento K&N 63-3059 es una mejora de posventa diseñada para mejorar el rendimiento y la eficiencia del motor. Este sistema de admisión reemplaza el conjunto de admisión de aire de fábrica con un filtro de aire reutilizable de flujo alto y tuberías de admisión personalizadas. El resultado es un flujo de aire mejorado hacia el motor, lo que le permite respirar con más libertad y potencialmente aumentar la potencia y el par motor. Además, el filtro de aire K&N es lavable y reutilizable, lo que significa que se puede limpiar y reinstalar, ahorrando dinero en filtros de repuesto con el tiempo. El sistema de admisión 63-3059 está diseñado para aplicaciones de vehículos específicos, asegurando un ajuste y compatibilidad adecuados. Con su proceso de instalación fácil y posibles ganancias de rendimiento, el Sistema de admisión de aire de alto rendimiento K&N es una opción popular para los entusiastas del automóvil que buscan mejorar el sistema de admisión de su vehículo.',
        category: 'Admisión de aire',
        image: 'K&N High Performance Air Intake System 63-3059.png',
        rating: {
          rate: 4.6,
          count: 400,
        },
      },
      {
        id: 33,
        title: 'Filtro de aceite de vida extendida STP S10358XL',
        price: 15.99,
        description:
          'El Filtro de aceite de vida extendida STP S10358XL es un filtro de aceite de alta calidad diseñado para proporcionar protección y rendimiento del motor duraderos. Diseñado con tecnología de filtración avanzada, captura y atrapa eficazmente contaminantes dañinos como suciedad, escombros y partículas metálicas, evitando que circulen por el motor y causen daños. El diseño de vida extendida significa que este filtro ofrece intervalos prolongados entre cambios de aceite, reduciendo la frecuencia y los costos de mantenimiento. Además, el S10358XL está construido con materiales duraderos para resistir las rigurosidades de la operación del motor y garantizar una filtración confiable durante su vida útil. Con su ingeniería de precisión y capacidades de filtración superiores, el Filtro de aceite de vida extendida STP S10358XL es una opción confiable para mantener la salud y la longevidad del motor.',
        category: 'Filtro',
        image: 'STP Extended Life Oil Filter S10358XL.png',
        rating: {
          rate: 2.1,
          count: 430,
        },
      },
      {
        id: 34,
        title:
          'Aceite de motor sintético completo para alto kilometraje STP 5W-20 5 Quart.png',
        price: 55.99,
        description:
          'El aceite de motor sintético completo para alto kilometraje STP en envase de 5 cuartos en viscosidad 5W-20 es un aceite de motor premium formulado específicamente para vehículos con alto kilometraje. Elaborado con aceites base sintéticos avanzados y un paquete de aditivos adaptado, ofrece una protección y rendimiento excepcionales para motores con más de 75,000 millas. El grado de viscosidad 5W-20 garantiza una excelente protección en arranques en frío y una lubricación óptima del motor en una amplia gama de temperaturas. Este aceite está diseñado para combatir problemas comunes en motores más antiguos, como desgaste, fugas y depósitos, y también rejuvenece sellos y empaques para ayudar a prevenir fugas. Con su formulación de alta calidad, el aceite de motor sintético completo para alto kilometraje STP ayuda a prolongar la vida útil del motor, reducir el consumo de aceite y mantener el rendimiento, lo que lo convierte en una opción ideal para conductores que buscan maximizar la longevidad y la confiabilidad de sus vehículos.',
        category: 'Aceites',
        image: 'STP High Mileage Full Synthetic Engine Oil 5W-20 5 Quart.png',
        rating: {
          rate: 4.7,
          count: 500,
        },
      },
      {
        id: 35,
        title: 'Batería para césped y jardín Valucraft CCA 190A U1-145',
        price: 22.3,
        description:
          'La batería para césped y jardín Valucraft con calificación CCA (Amperios de Arranque en Frío) de 190A y modelo U1-145 es una fuente de energía confiable diseñada específicamente para equipos de césped y jardín. Con su tamaño compacto y construcción duradera, esta batería es ideal para alimentar cortadoras de césped, tractores y otras maquinarias para exteriores. La calificación CCA de 190A garantiza una potencia de arranque confiable, incluso en condiciones climáticas frías, lo que la hace adecuada para uso durante todo el año. La designación del modelo U1-145 indica su tamaño específico y configuración de terminal, garantizando la compatibilidad con una amplia gama de equipos de césped y jardín. Ya sea que esté cortando el césped o cuidando su jardín, la batería para césped y jardín Valucraft proporciona el rendimiento confiable que necesita para mantener su equipo funcionando sin problemas.',
        category: 'Batería',
        image: 'Valucraft Lawn & Garden Battery CCA 190A U1-145.png',
        rating: {
          rate: 4.1,
          count: 259,
        },
      },
      {
        id: 36,
        title: 'Pastillas de freno cerámicas Duralast MKD1021',
        price: 109.95,
        description:
          'Las Pastillas de freno cerámicas Duralast MKD1021 ofrecen un rendimiento de frenado premium con un ruido y polvo mínimos. Diseñadas para diversos fabricantes y modelos de vehículos, estas pastillas garantizan una potencia de frenado constante y durabilidad. Su composición cerámica proporciona un rendimiento confiable en diversas condiciones de conducción, lo que las convierte en una excelente opción para viajes diarios o largos. Con el compromiso de Duralast con la calidad y la longevidad, las pastillas MKD1021 ofrecen experiencias de frenado seguras y suaves, mejorando la confianza del conductor en la carretera.',
        category: 'Batería',
        image: 'Duralast Ceramic Brake Pads MKD1021.png',
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
    ];

    return of(products);
  }
}
