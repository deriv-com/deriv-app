# Architecture and general philosophy of the project

## Brief
This project contains different dependency libraries and different packages used by the Core package (`@deriv/core`).

Each package in the `packages` folder is a dependency that eventually up to Core (the main app).

There are 2 types of dependencies:

1. Reusable code/libraries - These are packages that are meant to be loaded anywhere for use, and they enhance the application and/or development. At the time of writing, this includes: `@deriv/components`, `@deriv/shared`, `@deriv/p2p`, `@deriv/translations`.
2. Platforms/Modules/Apps - These can be viewed as applications of their own. According to business logic, these are different domains/sections, and most likely have their own route. At the time of writing, this includes: `@deriv/bot`, `@deriv/trader`.

The `@deriv/core` package is the "app instance". It contains singleton services (such as the WS, and base/common stores), as well as singleton UI components (header, footer, modals management, cashier).

_Hint: In order to simply build (without tests) type 1 dependencies, use the command `npm run build:travis` from the root of the package. In order to build type 2 dependencies, in the same manner, use `npm run build:local`._ 

## Diagram
To illustrate the structure above (with packages that exist at the time of writing, it would look something like below:
                                                                                  
                               +------------------------------+                                                                                                                                          
        +----------------------+ Core (deployed to app.deriv.com) |                                                                                                                                          
        |                      +-------+--------------+-------+                                                                                                                                          
        |                              |              |                                                                                                                                                  
        |                              |              |                                                                                                                                                  
        |   +-----+                    |              |                                                                                                                                                  
        |   |     |                    |              |                                                                                                                                                  
        +---+ P2P |                    |              |                                                                                                                                                  
        |   |     |               +----+---+       +--+--+                                                               Bundled here                                                                    
        |   +-----+               | Trader |       | Bot |                                                                                                                                               
        |                         +----+---+       +--+--+                                                                                                                                               
        |   +------------+             |              |                                                                                                                                                  
        |   |            +-------------+              |                                                                                                                                                  
        +---+ Components |             |              |                                                                                                                                                  
        |   |            +-------------|--------------+                                                                                                                                                  
        |   +------------+             |              |                                                                                                                                                  
        |                              |              |                                                                                                                                                  
        |   +--------+                 |              |                                                                                                                                                  
        |   |        +-----------------+              |                                                                                                                                               P2P
        +---+ Shared |                 |              |                                                                                                                                                  
        |   |        +-----------------|--------------+                                                                                                                                                  
        |   +--------+                 |              |                                                                                                                                                  
        |                              |              |                                                                                                                                                  
        |   +--------------+           |              |                                                                                                                                                  
        |   |              ------------+              |                                                                                                                                                  
        +---+ Translations |                          |                                                                                                                                                  
            |              ---------------------------+                                                                                                                                                  
            +--------------+                                                                                                                                               Shared, Components            
      Bundling of shared packages happen only once by Core
