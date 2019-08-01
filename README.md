# Gauzy

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fever-co%2Fgauzy.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fever-co%2Fgauzy?ref=badge_shield)

Gauzy™ - Fair Profits Sharing

- **Open-Source Software** solving **fair sharing of technology**.
- **Stock Options** solving **fair sharing of profits _in the future_**.
- **Gauzy** solving **fair sharing of profits _today_**.

## Why project named "Gauzy"?

> Because we believe in full transparency ("Gauzy" - "Transparent") and for our growing IT company we need to invent some process, which will make profits sharing simple and fair!

Ruslan, 20 May 2019

## Who (will) use Gauzy, How and Why?

Gauzy created for IT Service companies (agencies), where engineering department employee recieve monthly bonuses based on company profits generated from employee work for company clients. We believe it's a better way to distrubute profits fairly with employees compared to yearly bonuses and it should dramatically increase employees motivation and decrease retention!

Alternatives analysis:
* In most cases, revenue sharing does not target software developers (but target sales people instead) or provide benefits only on liquidity event (e.g. company sold or close) or give “shares” (with some vesting period). In all such cases, employee got "delayed" benefits, sometimes for years! Instead, we want some solution which works on a monthly basis!
* Some solutions such as _yearly_ bonuses are good and simple, but they value usually related very little to employee performance (who is doing such evaluation and how?), which is very hard to evaluate fairly over a year of work period. More so, it's common to pay some fixed bonuses (e.g. a monthly salary value paid once a year). More so, in modern engineering it is possible to gain significant skills growth over shorter periods than one year and having monthly recalculated bonuses will provide employees with faster income increase... That should motivate employees to learn new (or upgrade existed) skills as quickly as possible to be able to get bigger bonuses next month, not year! (e.g. “if I learn new skill/tool/platform/framework now, I will be able to get $X more per hour from our company clients and so my bonus will be bigger next month!”). So, there is going to be a direct correlation between employee skills changes and bonus value paid on montly basis!

#### We believe Gauzy Platform will make our own agency more transparent & fair to our own employees (and customers too). For now, we consider Gauzy as an our internal *experiment*, which we hope other companies will join if it proves itself to be at least some sort of success! ;) 

## Quick Start

- Intall [Yarn](https://github.com/yarnpkg/yarn) (if you don't have it) with `npm i -g yarn`
- Install NPM packages with `yarn install`
- Run API with `yarn start:api` (by default runs on http://localhost:3000/api)
- Run Gauzy front-end with `yarn start`
- Open http://localhost:4200 in your browser

Note: during the first API start, DB will be automatically seed with initial data if no users found. 
You can run seed any moment manually (e.g. if you changed entities schemas) with `yarn run seed` command to re-initialize DB (warning: unsafe for production!).

## Technology Stack

-   [TypeScript](https://www.typescriptlang.org)
-   [Node.js](https://nodejs.org)
-   [Nx](https://nx.dev)
-   [Angular 8](https://angular.io)
-   [Nest](https://github.com/nestjs/nest)
-   [RxJS](http://reactivex.io/rxjs)
-   [TypeORM](https://github.com/typeorm/typeorm)
-   [Ngx-admin](https://github.com/akveo/ngx-admin)

#### See also README.md and CREDITS.md files in relevant folders for lists of libraries and software included in the Platform, information about licenses and other details.

### How to use Nx

Please see our [Wiki page](https://github.com/ever-co/gauzy/wiki/How-to-use-Nx) about Nx usage

## Contribute

-   Please give us :star: on Github, it **helps**!
-   You are more than welcome to submit feature requests
-   Pull requests are always welcome! Please base pull requests against the _develop_ branch and follow the [contributing guide](.github/CONTRIBUTING.md).

## Collaborators and Contributors

### Development Team

#### Core

-   Ruslan Konviser ([Evereq](https://github.com/evereq))

#### Developers (alphabetical order)

-   Aleksandar Tasev ([AlexTasev](https://github.com/AlexTasev))
-   Alish Meklyov ([Alish](https://github.com/AlishMekliov931))
-   Blagovest Gerov ([BlagovestGerov](https://github.com/BlagovestGerov))
-   Boyan Stanchev ([boyanstanchev](https://github.com/boyanstanchev))
-   Elvis Arabadjiyski ([Dreemsuncho](https://github.com/Dreemsuncho))
-   Emil Momchilov ([jew-er](https://github.com/jew-er))
-   Hristo Hristov ([hrimar](https://github.com/hrimar))

#### Designers & QA

-   [Milena Dimova](https://www.linkedin.com/in/dimova-milena-31010414) (UI/UX Designer)
-   [Julia Konviser](https://www.linkedin.com/in/julia-konviser-8b917552) (Graphic Designer, QA)

### Contributors

-   View all of our [contributors](https://github.com/ever-co/gauzy/graphs/contributors)

## Contact Us

-   For business inquiries: <mailto:ever@ever.co>
-   Please report security vulnerabilities to <mailto:security@ever.co>

## Security

Gauzy™ follows good security practices, but 100% security cannot be guaranteed in any software!  
Gauzy™ is provided AS IS without any warranty. Use at your own risk!  
See more details in the [LICENSE](LICENSE).

In a production setup, all client-side to server-side (backend, APIs) communications should be encrypted using HTTPS/WSS/SSL (REST APIs, GraphQL endpoint, Socket.io WebSockets, etc.).

## License

This software is available under [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.txt)

This program is free software: you can redistribute it and/or modify it under the terms of the corresponding licenses described in the LICENSE files located in software sub-folders and under the terms of licenses described in individual files.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

You should have received a copy of the relevant GNU Licenses along with this program. If not, see http://www.gnu.org/licenses/.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fever-co%2Fgauzy.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fever-co%2Fgauzy?ref=badge_large)

## Trademarks

Gauzy™ is a trademark of Ever Co. LTD.  
All other brand and product names are trademarks, registered trademarks or service marks of their respective holders.

#### Copyright © 2019, Ever Co. LTD. All rights reserved.
