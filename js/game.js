/*
class Building
  - constructor()
  - buy()
  - setCost()
  - buyUpgrade()
  - calculateEffectOfUpgrades()
  - getCPS()
  - getCost()
  - generateMenuButton()›
  - generateBuyButtons()
  - generateUpgradeButtons()
  - generateShopHTML()
class Upgrade
  - contructor()
  - requirementMet()
class Player
  - constructor()
  - earnCookie()
  - spendCookie()
  - clickCookie()
let game
- settings
- buildings
- utilities
- saving
- player
- logic()
- updateDisplays()
- consstructShop()
- currentShop
- updateShop()
- buyBuilding()
- buyUpgrade()
- checkBuyOk()
- start()
*/

class Building {
    constructor(name, id, icon, color, cost, effect, upgrades, locked = true) {
        this.name = name;
        this.id = id;
        this.icon = icon;
        this.color = color;
        this.amount = 0;
        this.originalCost = cost;
        this.cost = cost;
        this.buyReady = false;
        this.multiplier = 1;
        this.baseEffect = effect;
        this.specialCPS = 0;
        this.effect = 0;
        this.upgrades = upgrades;
        this.locked = locked;
    }

    buy(amount) {
        let player = game.player;
        if (player.spendCookies(this.getCost(amount)) == true) {
            this.amount += amount;

            //write an if statement for this and the setCost() for running Math.round
              //this.cost = Math.round(this.cost * Math.pow(1.15, amount));
            this.cost = this.cost * Math.pow(1.15, amount);

            game.settings.recalculateCPS = true;
            let curIndex = game.utilities.getBuildingIndexByName(this.name);
            if (curIndex + 1 <= game.buildings.length - 1) {
                let nextBuilding = game.buildings[curIndex + 1];
                if (nextBuilding.locked == true) {
                    nextBuilding.locked = false;
                    game.constructShop();
                }
            }
        }
    }

    setCost() {
        this.cost = this.originalCost;
        for (let i = 1; i < this.amount; i++) {
            console.log("ROUNDED THE COST NUMBER")
            this.cost = this.cost * 1.15;
            //this.cost = Math.round(this.cost * 1.15);

        }
    }

    buyUpgrade(name) {
        let player = game.player;
        this.upgrades.forEach(upgrade => {
            this.getUpgradeBuyCheck(name);
            if (upgrade.name == name) {
                if (player.spendCookies(upgrade.cost) == true) {
                    upgrade.owned = true;
                    game.settings.recalculateCPS = true;
                    return;
                }
            }
        });
    }

    calculateEffectOfUpgrades() {

      //this.multiplier = this.calculateEffectOfUpgrades();
      //this.effect = ((this.baseEffect * this.amount) * this.multiplier) + this.specialCPS;
      //return this.effect;

        let player = game.player;
        let multiplier = 1;
        let buildingCount = game.utilities.getBuildingCount();
        this.specialCPS = 0;
        if (this.name == 'Essence Vortex') { game.player.aMPC = 0.001; }
        this.upgrades.forEach(upgrade => {
            if (upgrade.owned == true) {
                if (upgrade.special == false) {
                    multiplier *= 2;
                    if (this.name == 'Essence Vortex') {
                        player.aMPC *= 2;
                    }
                } else {
                    // Special casing for all special types of upgrades
                    // There may at some point be more than just cursors here, as theres special stuff for grandmas as well.
                    switch (this.name) {
                        case 'Essence Vortex':
                            let nonCursorBuildingCount = buildingCount - this.amount;
                            this.specialCPS += (upgrade.special * nonCursorBuildingCount) * this.amount;
                            player.aMPC += (upgrade.special * nonCursorBuildingCount);
                    }
                }
            }
        });
        return multiplier;
    }

    getCPS() {
        this.multiplier = this.calculateEffectOfUpgrades();
        this.effect = ((this.baseEffect * this.amount) * this.multiplier) + this.specialCPS;
        return this.effect;
    }

    getBuyCheck(buildingName) {
        if(this.cost <= game.player.cookies){
          //console.log("BUY-YES! " + buildingName)
          return true;
        } else {
          //console.log("BUY-NO! " + buildingName)
          return false;
        }
    }

    getUpgradeBuyCheck(upgradeName) {
        if(this.upgrades.cost <= game.player.cookies){
          console.log("BUYUP-YES! " + upgradeName)
          return true;
        } else {
          console.log("BUYUP-NO! " + upgradeName)
          return false;
        }
    }

    getCost(amount) {
        let bulkCost = this.cost;
        let tempPrice = this.cost;
        for (let i = 0; i < amount - 1; i++) {
            bulkCost += Math.round(tempPrice *= 1.15);
        }
        return bulkCost;
    }

    generateMenuButton() {
        //return `<button onclick="game.updateShop('${this.name}');">${this.name}</button>`;
        return `${this.generateBuyButtons()}`;
    }



    generateBuyButtons() {
        let format = game.utilities.formatNumber;
        let singleEffect = (this.baseEffect * this.multiplier)
        if (this.specialCPS > 0) {
            singleEffect += (this.specialCPS / this.amount);
        }
        let html = '';
        html += `

        <a id="${this.id}" class="py-0 lh-1 list-group-item list-group-item-action link" style="cursor:pointer;

        " aria-current="true" onclick="game.buyBuilding('${this.name}', 1);" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="left" data-bs-html="true" data-bs-content="Each = 0.4 cookie.<br> Combined = 5.2 cookie.">
          <div class="d-flex w-100 pb-0 align-items-center" >
            <span class="addText">
              <div class=" flex-grow-1 mb-1 ms-3 lh-1">
                  <small class="text-muted font-thin" style="position:relative; left:+32px;">
                  <span class="icon-font small" style="position:relative; top:+4px; left:-1px;">&#xF1D3;</span>
                  <span class="small">${format(singleEffect)}/sec = ONE</span><br>

                  <span class="icon-font small" style="position:relative; top:+4px; left:-1px;">&#xF1D3;</span>
                  <span class="small">${format(this.effect)}/sec = ALL</span>
                  </small>
                  <br>
                  <small class="font-thin small fw-normal" style="font-size:0.8rem; position:relative; top:+1px; left:+3px;">Buy:</small>
                  <span class="icon-font small" style="position:relative; top:+4px; left:-0px;">&#xF1D3;</span>
                <small class="font-thin small fw-normal color-green cost-disabled" style="font-size:0.9rem; position:relative; top:+2px; left:-3px;">${format(this.cost)}</small>
              </div>
            </span>
            <div class="content-stuff icon-font" style="">
              <div class="fs-6 ${this.color}">${this.icon}</div>
            </div>
            <div class="flex-grow-1 ms-3 content-stuff font-thin fs-6  fw-light" style="font-size:0.9rem!important;text-transform: uppercase; line-height: 1.1em;">${this.name}<br>
              <span class="icon-font small" style="position:relative; top:+4px; left:-1px;">&#xF1D3;</span>
              <small class="font-thin small fw-normal color-green cost-disabled" style="font-size:0.9rem; position:relative; top:+2px; left:-3px;">${format(this.cost)}</small>
            </div>
            <div class="font-book " style="font-weight: 300; font-size: 2.0rem;letter-spacing: 3px;">${this.amount}</div>
          </div>
        </a>
        `
        //<button  type="button" class="btn btn-primary"  title="Background" data-tooltip="tooltip" data-placement="right" onclick="game.buyBuilding('${this.name}', 1);">${this.name} Cost: ${format(this.cost)}<br> Total: ${this.amount}</button>`
        //html += `<button onclick="game.buyBuilding('${this.name}', 5);">Buy x5</br><b>${format(this.getCost(5))}</b></button>`;
        //html += `<button onclick="game.buyBuilding('${this.name}', 10);">Buy x10</br><b>${format(this.getCost(10))}</b></button>`;
        html += '';
        return html;

    }

    generateUpgradeButtons(buildingName) {
        let html = '';
        let notMet = false;
        let upgradeSameCount = 0;
        let disabledText = '';
        this.upgrades.forEach(upgrade => {

            let format = game.utilities.formatNumber;
            if (upgrade.owned == false) {
                if (upgrade.requirementMet(this.amount)) {
                    if (upgradeSameCount == 0){
                      if (buildingName == buildingName){upgradeSameCount++} else {upgradeSameCount = 0};
                      if (upgrade.cost > game.player.cookies){disabledText = 'disabled'}
                      game.player.upgradesAvaliable += 1;
                      let addCssNameId = 'upgrade' + game.player.upgradesAvaliable;
                      console.log(addCssNameId);
                    html += `
                    <a id="${upgrade.id}" class="py-0 lh-1 list-group-item list-group-item-action link " style="cursor:pointer;" aria-current="true" onclick="game.buyUpgrade('${this.name}', '${upgrade.name}')" data-bs-trigger="hover focus" data-bs-toggle="popover" data-bs-placement="left" data-bs-html="true" data-bs-content="Each = 0.4 cookie.<br> Combined = 5.2 cookie.">
                      <div class="d-flex w-100 pb-0 align-items-center">
                        <span class="addText">
                          <div class=" flex-grow-1 mb-1 ms-3 lh-1">

                            <span style="position:relative; left:-8px;">
                            <small class="font-thin small fw-normal" style="font-size:0.8rem; position:relative; top:+1px; left:+3px;">Upgrade: ${upgrade.desc}</small><br>
                            <small class="text-muted font-thin" style="position:relative; left:+3px;">
                              <span class="small ">${upgrade.flavor}</span>
                            </small>
                            <br>
                            <small class="font-thin small fw-normal" style="font-size:0.8rem; position:relative; top:+1px; left:+3px;">Buy:</small>
                            <span class="icon-font small" style="position:relative; top:+4px; left:-0px;">&#xF1D3;</span>
                            <small class="font-thin small fw-normal color-green cost-disabled" style="font-size:0.9rem; position:relative; top:+2px; left:-3px;">${format(upgrade.cost)}</small>

                            </span>

                          </div>
                        </span>
                        <div class="content-stuff icon-font" style="">
                          <div class="fs-6" style="color:#9c78ff;">${this.icon}</div>
                        </div>
                        <div class="flex-grow-1 ms-3 content-stuff font-thin fs-6  fw-thin" style="font-size:0.9rem!important; line-height: 1.1em;"> ${upgrade.name}
                          <br>
                          <span class="icon-font small" style="position:relative; top:+4px; left:-1px;">&#xF1D3;</span>
                          <small class="font-thin small fw-normal color-green cost-disabled" style="font-size:0.9rem; position:relative; top:+2px; left:-3px;">${format(upgrade.cost)}</small>
                        </div>
                      </div>
                    </a>`;

                  }


                }


                //else {
                //    if (notMet == false) {
                //        notMet = true;
                //        html += `</br><button class="upgNext">Next upgrade in <b>${upgrade.limit - this.amount}</b> more ${this.name.toLowerCase()}(s)</button>`;
                //    }
                //}

            }

        });

        return html;

    }




    generateShopHTML() {
        let format = game.utilities.formatNumber;
        let singleEffect = (this.baseEffect * this.multiplier)
        if (this.specialCPS > 0) {
            singleEffect += (this.specialCPS / this.amount);
        }
        let html = `<b>${this.name}</b></br>You have <b>${this.amount}</b> ${this.name.toLowerCase()}(s).</br>Each ${this.name.toLowerCase()} produces <b>${format(singleEffect)}</b> cookie(s).</br>All of your ${this.name.toLowerCase()}(s) combined produces <b>${format(this.effect)}</b> cookie(s).</br>${this.generateBuyButtons()}</br>${this.generateUpgradeButtons()}`;
        return html;
    }
}

class Upgrade {
    constructor(name, id, cost, desc, flavor, limit, special = false) {
        this.name = name;
        this.id = id;
        this.cost = cost;
        this.desc = desc;
        this.flavor = flavor;
        this.limit = limit;
        this.owned = false;
        this.special = special;
    }

    requirementMet(amount) {
        if (amount >= this.limit) {
            return true;
        }
    }
}

class Player {
    constructor() {
        this.cookies = 0;
        this.cookieStats = {
            Earned: 0,
            Spent: 0,
            Clicked: 0
        }
        this.aMPF = 0;
        this.aMPC = 0;
        this.upgradesAvaliable = 0;
    }

    earnCookie(amount) {
        this.cookies += amount;
        this.cookieStats.Earned += amount;
    }

    spendCookies(amount) {
        if (this.cookies >= amount) {
            this.cookies -= amount;
            this.cookieStats.Spent += amount;
            return true;
        }
    }

    clickCookie() {
        this.earnCookie(this.aMPC);
        this.cookieStats.Clicked += this.aMPC;
    }
}

let game = {
    settings: {
        frameRate: 30,
        recalculateCPS: true,
        key: 'cookieclicker'
    },
    buildings: [
        // Generate all buildings here
        //building constructor(name, id, icon, color, cost, effect, upgrades, locked = true)
        new Building('Essence Vortex', 'shape-infuser', '&#xF2FF;', 'color-black', 0.015, 0.0001, [
            //upgrad constructor(name, id, cost, desc, flavor, limit, special = false) limit = required amount of building.
            new Upgrade('Entanglement Regulator', '1-1', 0.1, '<span class="icon-font" style="position:relative; top:+1px;">&#xF2FF;</span> <span class="color-green"style="font-size:0.9rem;">2x</span> production', 'Enables access to multiple timelines simultaneously.', 0.001),
            new Upgrade('Chrono Amplification Module', '1-2', 0.5, 'item #X', 'Increases the potency and duration', 1),
            new Upgrade('Ambidextrous', '1-3', 10, 'Upgrade: item #X', 'Cursors and clicking are twice as efficient<br>Cursors and clicking are twice as efficient', 10),
            new Upgrade('SP1 Thousand Fingers', '1-4', 100, 'item #X', 'Mouse and cursors gain +0.1 cookies for every non-cursor building owned', 25, 0.1),
            new Upgrade('SP2 Million Fingers', '1-5', 10000, 'Upgrade: item #X', 'Mouse and cursors gain +0.5 cookies for every non-cursor building owned', 50, 0.5),
            new Upgrade('SP3 Billion Fingers', '1-6', 100000, 'Upgrade: item #X', 'Mouse and cursors gain +5 cookies for every non-cursor building owned', 100, 5),
            new Upgrade('Trillion Fingers', '1-7', 1000000, 'Upgrade: item #X', 'Mouse and cursors gain +50 for every non-cursor building owned', 150, 50),
            new Upgrade('Quadrillion Fingers', '1-8', 10000000, 'Upgrade: item #X', 'Mouse and cursors gain +500 cookies for each non-cursor building owned', 200, 500),
            new Upgrade('Quintillion Fingers', '1-9', 10000000000, 'Upgrade: item #X', 'Mouse and cursors gain +5.000K for every non-cursor building owned', 250, 5000),
            new Upgrade('Sextillion Fingers', '1-10', 10000000000000, 'Upgrade: item #X', ' Mouse and cursors gain +50.000K for every non-cursor building owned', 300, 50000),
            new Upgrade('Septillion Fingers', '1-11', 10000000000000000000, 'Upgrade: item #X', 'Mouse and cursors gain +500.000K for every non-cursor building owned', 350, 500000),
            new Upgrade('Octillion Fingers', '1-12', 10000000000000000000000, 'Upgrade: item #X', 'Mouse and cursors gain +5.000M for each non-cursor building owned', 400, 5000000)
        ], false),
        new Building('Shape Infuser', 'essence-vortex', '&#xF625;', 'color-black', 0.1, 0.001, [
            new Upgrade('Material Fusion Chamber', '2-1', 1, '<span class="icon-font" style="position:relative; top:+1px;">&#xF625;</span> <span class="color-green"style="font-size:0.9rem;">2x</span> production', 'Create unique and durable composite structures.', 1),
            new Upgrade('Spatial Expansion Matrix', '2-2', 5, '<span class="icon-font" style="position:relative; top:+1px;">&#xF625;</span> <span class="color-green"style="font-size:0.9rem;">2x</span> production', 'Increases the size and volume of objects created.', 5),
            new Upgrade('Lubricated dentures', '2-3', 50, 'Upgrade: item #X', 'Grandmas are twice as efficient', 25),
            new Upgrade('Prune juice', '2-4', 5000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 50),
            new Upgrade('Double-thick glasses', '2-5', 500000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 100),
            new Upgrade('Aging agents', '2-6', 50000000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 150),
            new Upgrade('Xtreme walkers', '2-7', 50000000000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 200),
            new Upgrade('The Unbridling', '2-8', 50000000000000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 250),
            new Upgrade('Reverse dementia', '2-9', 50000000000000000000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 300),
            new Upgrade('Timeproof hair dyes', '2-10', 50000000000000000000000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 350),
            new Upgrade('Good manners', '2-11', 500000000000000000000000000, 'Upgrade: item #X', 'Grandmas are twice as efficient', 400),
        ]),
        new Building('Temporal Chip', 'temporal-chip', '&#xF2D6;', 'color-black', 1.1, 0.008, [
            new Upgrade('Cheap hoes', '3-1', 11, 'item #X', 'Farms are twice as efficient', 1),
            new Upgrade('Fertilizer', '3-2', 55, 'item #X', 'Farms are twice as efficient', 5),
            new Upgrade('Biscuit Trees', '3-3', 550, 'Upgrade: item #X', 'Farms are twice as efficient', 25),
            new Upgrade('Genetically-modified Biscuits', '3-4', 55000, 'Upgrade: item #X', 'Farms are twice as efficient', 50),
            new Upgrade('Gingerbread scarecrows', '3-5', 5500000, 'Upgrade: item #X', 'Farms are twice as efficient', 100),
            new Upgrade('Pulsar sprinklers', '3-6', 550000000, 'Upgrade: item #X', 'Farms are twice as efficient', 150),
            new Upgrade('Fudge fungus', '3-7', 550000000000, 'Upgrade: item #X', 'Farms are twice as efficient', 200),
            new Upgrade('Wheat triffids', '3-8', 550000000000000, 'Upgrade: item #X', 'Farms are twice as efficient<br>Farms are twice as efficient', 250),
            new Upgrade('Humane pesticides', '3-9', 550000000000000000000, 'Upgrade: item #X', 'Farms are twice as efficient', 300),
            new Upgrade('Barnstars', '3-10', 550000000000000000000000, 'Upgrade: item #X', 'Ah, yes. These help quite a bit. Somehow.', 350),
            new Upgrade('Lindworms', '3-11', 5500000000000000000000000000, 'Upgrade: item #X', 'You have to import these from far up north, but they really help areate the soil', 400)
        ]),
        new Building('Fabric Folding', 'fabric-folding', '&#xF45B;', 'color-red', 12, 0.047, [
            new Upgrade('Sugar gas', '4-1', 120000, 'Upgrade: item #X', 'Mines are twice as efficient', 1),
            new Upgrade('Megadrill', '4-2', 600000, 'Upgrade: item #X', 'Mines are twice as efficient', 5),
            new Upgrade('Ultradrill', '4-3', 6000000, 'Upgrade: item #X', 'Mines are twice as efficient', 25),
            new Upgrade('Ultimadrill', '4-4', 600000000, 'Upgrade: item #X', 'Mines are twice as efficient', 50),
            new Upgrade('H-bomb Mining', '4-5', 60000000000, 'Upgrade: item #X', 'Mines are twice as efficient<br>Mines are twice as efficient', 100),
            new Upgrade('Coreforge', '4-6', 6000000000000, 'Upgrade: item #X', 'Mines are twice as efficient<br>Mines are twice as efficient', 150),
            new Upgrade('Planetsplitters', '4-7', 6000000000000000, 'Upgrade: item #X', 'Mines are twice as efficient<br>Mines are twice as efficient', 200),
            new Upgrade('Canola oil wells', '4-8', 6000000000000000000, 'Upgrade: item #X', 'Mines are twice as efficient<br>Mines are twice as efficient', 250),
            new Upgrade('Mole People', '4-9', 6000000000000000000000, 'Upgrade: item #X', 'Mines are twice as efficient', 300),
            new Upgrade('Mine canaries', '4-10', 6000000000000000000000000, 'Upgrade: item #X', 'Mines are twice as efficient', 350),
            new Upgrade('Bore again', '4-11', 60000000000000000000000000000, 'Upgrade: item #X', 'Mines are twice as efficient', 400)
        ]),
        new Building('Memories Chip', 'memories-chip', '&#xF6E3;', 'color-red', 130, 0.26, [
            new Upgrade('Sturdier conveyor belts', '5-1', 1300000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 1),
            new Upgrade('Child labor', '5-2', 6500000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 5),
            new Upgrade('Sweatshop', '5-3', 65000000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 25),
            new Upgrade('Radium reactors', '5-4', 6500000000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 50),
            new Upgrade('Recombobulators', '5-5', 650000000000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 100),
            new Upgrade('Deep-bake process', '5-6', 65000000000000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 150),
            new Upgrade('Cyborg workforce', '5-7', 65000000000000000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 200),
            new Upgrade('78-hour days', '5-8', 65000000000000000000, 'Upgrade: item #X', 'Factories are twice as efficient<br>Factories are twice as efficient', 250),
            new Upgrade('Machine learning', '5-9', 65000000000000000000000, 'Upgrade: item #X', 'Factories are twice as efficient', 300),
            new Upgrade('Brownie point system', '5-10', 65000000000000000000000000, 'Upgrade: item #X', 'Factories are twice as efficient', 350),
            new Upgrade('"Volunteer" interns', '5-11', 650000000000000000000000000000, 'Upgrade: item #X', 'Factories are twice as efficient', 400)
        ]),
        new Building('Cold Storage', 'cold-storage', '&#xF65A;', 'color-red', 1400, 1.4, [
            new Upgrade('Taller Tellers', '6-1', 14000000, 'Upgrade: item #X', 'Banks are twice as efficient<br>Banks are twice as efficient', 1),
            new Upgrade('Scissor-resistant Credit Cards', '6-2', 70000000, 'Upgrade: item #X', 'Banks are twice as efficient<br>Banks are twice as efficient', 5),
            new Upgrade('Acid-proof vaults', '6-3', 700000000, 'Upgrade: item #X', 'Banks are twice as efficient<br>Banks are twice as efficient', 25),
            new Upgrade('Chocolate coins', '6-4', 70000000000, 'Upgrade: item #X', 'Banks are twice as efficient<br>Banks are twice as efficient', 50),
            new Upgrade('Exponential interest rates', '6-5', 7000000000000, 'Upgrade: item #X', 'Banks are twice as efficient<br>Banks are twice as efficient', 100),
            new Upgrade('Financial zen', '6-6', 700000000000000, 'Upgrade: item #X', 'Banks are twice as efficient<br>Banks are twice as efficient', 150),
            new Upgrade('Way of the wallet', '6-7', 700000000000000000, 'Upgrade: item #X', 'Banks are twice as efficient<br>Banks are twice as efficient', 200),
            new Upgrade('The stuff rationale', '6-8', 700000000000000000000, 'Upgrade: item #X', 'Banks are twice as efficient', 250),
            new Upgrade('Edible money', '6-9', 700000000000000000000, 'Upgrade: item #X','Banks are twice as efficient', 300),
            new Upgrade('Grand supercycle', '6-10', 700000000000000000000000, 'Upgrade: item #X', 'Banks are twice as efficient', 350),
            new Upgrade('Rules of acquisition', '6-11', 7000000000000000000000000000, 'Upgrade: item #X', 'Banks are twice as efficient', 400)
        ])
        /*
        ,
        new Building('Amped Flows', 'amped-flows', '&#xF46D;', 20000000, 7800, [
            new Upgrade('Golden idols', 200000000, 'Temples are twice as efficient', 1),
            new Upgrade('Sacrifices', 1000000000, 'Temples are twice as efficient', 5),
            new Upgrade('Delicious blessing', 10000000000, 'Temples are twice as efficient', 25),
            new Upgrade('Sun festival', 1000000000000, 'Temples are twice as efficient', 50),
            new Upgrade('Enlarged pantheon', 100000000000000, 'Temples are twice as efficient', 100),
            new Upgrade('Great Baker in the sky', 10000000000000000, 'Temples are twice as efficient', 150),
            new Upgrade('Creation myth', 10000000000000000000, 'Temples are twice as efficient', 200),
            new Upgrade('Theocracy', 10000000000000000000000, 'Temples are twice as efficient', 250),
            new Upgrade('Sick rap prayers', 10000000000000000000000000, 'Temples are twice as efficient', 300),
            new Upgrade('Psalm-reading', 10000000000000000000000000000, 'Temples are twice as efficient', 350),
            new Upgrade('War of the gods', 100000000000000000000000000000000, 'Temples are twice as efficient', 400)
        ]),
        new Building('Logic Sims', 'logic-sims', '&#xF503;', 330000000, 44000, [
            new Upgrade('Pointier hats', 3300000000, 'Wizard towers are twice as efficient', 1),
            new Upgrade('Beardlier beards', 16500000000, 'Wizard towers are twice as efficient', 5),
            new Upgrade('Ancient grimoires', 165000000000, 'Wizard towers are twice as efficient', 25),
            new Upgrade('Kitchen curses', 16500000000000, 'Wizard towers are twice as efficient', 50),
            new Upgrade('School of sorcery', 1650000000000000, 'Wizard towers are twice as efficient', 100),
            new Upgrade('Dark formulas', 165000000000000000, 'Wizard towers are twice as efficient', 150),
            new Upgrade('Cookiemancy', 165000000000000000000, 'Wizard towers are twice as efficient', 200),
            new Upgrade('Rabbit trick', 165000000000000000000000, 'Wizard towers are twice as efficient', 250),
            new Upgrade('Deluxe tailored wands', 165000000000000000000000000, 'Wizard towers are twice as efficient', 300),
            new Upgrade('Immobile spellcasting', 165000000000000000000000000000, 'Wizard towers are twice as efficient', 350),
            new Upgrade('Electricity', 1650000000000000000000000000000000, 'Wizard towers are twices as efficient', 400)
        ]),
        new Building('Laced Curves', 'laced-curves', '&#xF50D;', 5100000000, 260000, [
            new Upgrade('Vanilla nebulae', 51000000000, 'Shipments are twice as efficient', 1),
            new Upgrade('Wormholes', 255000000000, 'Shipments are twice as efficient', 5),
            new Upgrade('Frequent flyer', 2550000000000, 'Shipments are twice as efficient', 25),
            new Upgrade('Warp drive', 255000000000000, 'Shipments are twice as efficient', 50),
            new Upgrade('Chocolate monoliths', 25500000000000000, 'Shipments are twice as efficient', 100),
            new Upgrade('Generation ship', 2550000000000000000, 'Shipments are twice as efficient', 150),
            new Upgrade('Dyson sphere', 2550000000000000000000, 'Shipments are twice as efficient', 200),
            new Upgrade('The final frontier', 2550000000000000000000000, 'Shipments are twice as efficient', 250),
            new Upgrade('Autopilot', 2550000000000000000000000000, 'Shipments are twice as efficient', 300),
            new Upgrade('Restaurants at the end of the universe', 2550000000000000000000000000000, 'Shipments are twice as efficient', 350),
            new Upgrade('Universal alphabet', 25500000000000000000000000000000000, 'Shipments are twice as efficient', 400)
        ]),
        new Building('Time Tunnels', 'time-tunnels', '&#xF421;', 75000000000, 1500000, [
            new Upgrade('Antimony', 750000000000, 'Alchemy labs are twice as efficient', 1),
            new Upgrade('Essence of dough', 3750000000000, 'Alchemy labs are twice as efficient', 5),
            new Upgrade('True chocolate', 37500000000000, 'Alchemy labs are twice as efficient', 25),
            new Upgrade('Ambrosia', 3750000000000000, 'Alchemy labs are twice as efficient', 50),
            new Upgrade('Aqua crustulae', 375000000000000000, 'Alchemy labs are twice as efficient', 100),
            new Upgrade('Origin crucible', 37500000000000000000, 'Alchemy labs are twice as efficient', 150),
            new Upgrade('Theory of atomic fluidity', 37500000000000000000000, 'Alchemy labs are twice as efficient', 200),
            new Upgrade('Beige goo', 37500000000000000000000000, 'Alchemy labs are twice as efficient', 250),
            new Upgrade('The advent of chemistry', 37500000000000000000000000000, 'Alchemy labs are twice as efficient', 300),
            new Upgrade('On second thought', 37500000000000000000000000000000, 'Alchemy labs are twice as efficient', 350),
            new Upgrade('Public betterment', 375000000000000000000000000000000000, 'Alchemy labs are twice as efficient', 400)
        ]),
        new Building('Grid Dimensions', 'grid-dimensions', '&#xF466;', 1000000000000, 10000000, [
            new Upgrade('Ancient tablet', 10000000000000, 'Portals are twice as efficient', 1),
            new Upgrade('Insane oatling workers', 50000000000000, 'Portals are twice as efficient', 5),
            new Upgrade('Soul bond', 500000000000000, 'Portals are twice as efficient', 25),
            new Upgrade('Sanity dance', 50000000000000000, 'Portals are twice as efficient', 50),
            new Upgrade('Brane transplant', 5000000000000000000, 'Portals are twice as efficient', 100),
            new Upgrade('Deity-sized portals', 500000000000000000000, 'Portals are twice as efficient', 150),
            new Upgrade('End of times back-up plan', 500000000000000000000000, 'Portals are twice as efficient', 200),
            new Upgrade('Maddening chants', 500000000000000000000000000, 'Portals are twice as efficient', 250),
            new Upgrade('The real world', 500000000000000000000000000000, 'Portals are twice as efficient', 300),
            new Upgrade('Dimensional garbage gulper', 500000000000000000000000000000000, 'Portals are twice as efficient', 350),
            new Upgrade('Embedded microportals', 5000000000000000000000000000000000000, 'Portals are twice as efficient', 400)
        ]),
        new Building('Infinite Reasoning', 'infinite-reasoning', '&#xF69E;', 14000000000000, 65000000, [
            new Upgrade('Flux capacitors', 140000000000000, 'Time machines are twice as efficient', 1),
            new Upgrade('Time paradox resolver', 700000000000000, 'Time machines are twice as efficient', 5),
            new Upgrade('Quantum conundrum', 7000000000000000, 'Time machines are twice as efficient', 25),
            new Upgrade('Causality enforcer', 700000000000000000, 'Time machines are twice as efficient', 50),
            new Upgrade('Yestermorrow comparators', 70000000000000000000, 'Time machines are twice as efficient', 100),
            new Upgrade('Far future enactment', 7000000000000000000000, 'Time machines are twice as efficient', 150),
            new Upgrade('Great loop hypothesis', 7000000000000000000000000, 'Time machines are twice as efficient', 200),
            new Upgrade('Cookietopian moments of maybe', 7000000000000000000000000000, 'Time machines are twice as efficient', 250),
            new Upgrade('Second seconds', 7000000000000000000000000000000, 'Time machines are twice as efficient', 300),
            new Upgrade('Additional clock hands', 7000000000000000000000000000000000, 'Time machines are twice as efficient', 350),
            new Upgrade('Nostalgia', 70000000000000000000000000000000000000, 'Time machines are twice as efficient', 400)
        ]),
        new Building('Antimatter Condenser', 'antimatter-condenser', 'fa-sticky-note', 170000000000000, 430000000, [
            new Upgrade('Sugar bosons', 1700000000000000, 'Antimatter condensers are twice as efficient', 1),
            new Upgrade('String theory', 8500000000000000, 'Antimatter condensers are twice as efficient', 5),
            new Upgrade('Large macaron collider', 85000000000000000, 'Antimatter condensers are twice as efficient', 25),
            new Upgrade('Big bang bake', 8500000000000000000, 'Antimatter condensers are twice as efficient', 50),
            new Upgrade('Reverse cyclotrons', 850000000000000000000, 'Antimatter condensers are twice as efficient', 100),
            new Upgrade('Nanocosmics', 85000000000000000000000, 'Antimatter condensers are twice as efficient', 150),
            new Upgrade('The Pulse', 85000000000000000000000000, 'Antimatter condensers are twice as efficient', 200),
            new Upgrade('Some other super-tiny fundamental particle? Probably?', 85000000000000000000000000000, 'Antimatter condensers are twice as efficient', 250),
            new Upgrade('Quantum comb', 85000000000000000000000000000000, 'Antimatter condensers are twice as efficient', 300),
            new Upgrade('Baking Nobel prize', 85000000000000000000000000000000000, 'Antimatter condensers are twice as efficient', 350),
            new Upgrade('The definite molecule', 850000000000000000000000000000000000000, 'Antimatter condensers are twice as efficient', 400)
        ]),
        new Building('Prism', 'prism', 'fa-sticky-note', 2100000000000000, 2900000000, [
            new Upgrade('Gem polish', 21000000000000000, 'Prims are twice as efficient', 1),
            new Upgrade('9th color', 105000000000000000, 'Prims are twice as efficient', 5),
            new Upgrade('Chocolate light', 1050000000000000000, 'Prims are twice as efficient', 25),
            new Upgrade('Grainbow', 105000000000000000000, 'Prims are twice as efficient', 50),
            new Upgrade('Pure cosmic light', 10500000000000000000000, 'Prims are twice as efficient', 100),
            new Upgrade('Glow-in-the-dark', 1050000000000000000000000, 'Prims are twice as efficient', 150),
            new Upgrade('Lux sanctorum', 1050000000000000000000000000, 'Prims are twice as efficient', 200),
            new Upgrade('Reverse shadows', 1050000000000000000000000000000, 'Prims are twice as efficient', 250),
            new Upgrade('Crystal mirrors', 1050000000000000000000000000000000, 'Prims are twice as efficient', 300),
            new Upgrade('Reverse theory of light', 1050000000000000000000000000000000000, 'Prisms are twice as efficient', 350),
            new Upgrade('Light capture measures', 10500000000000000000000000000000000000000, 'Prisms are twice as efficient', 400)
        ]),
        new Building('Chancemaker', 'chancemaker', 'fa-sticky-note', 26000000000000000, 21000000000, [
            new Upgrade('Your lucky cookie', 260000000000000000, 'Chancemakers are twice as efficient', 1),
            new Upgrade('\'All Bets Are Off\' magic coin', 130000000000000000, 'Chancemakers are twice as efficient', 5),
            new Upgrade('Winning lottery ticket', 13000000000000000000, 'Chancemakers are twice as efficient', 25),
            new Upgrade('Four-leaf clover field', 130000000000000000000, 'Chancemakers are twice as efficient', 50),
            new Upgrade('A recipe book about books', 13000000000000000000000, 'Chancemakers are twice as efficient', 100),
            new Upgrade('Leprechaun village', 13000000000000000000000000, 'Chancemakers are twice as efficient', 150),
            new Upgrade('Improbability drive', 13000000000000000000000000000, 'Chancemakers are twice as efficient', 200),
            new Upgrade('Antisuperstistronics', 13000000000000000000000000000000, 'Chancemakers are twice as efficient', 250),
            new Upgrade('Bunnypedes', 13000000000000000000000000000000000, 'Chancemakers are twice as efficient', 300),
            new Upgrade('Revised probalistics', 13000000000000000000000000000000000000, 'Chancemakers are twice as efficient', 350),
            new Upgrade('0-sided dice', 130000000000000000000000000000000000000000, 'Chancemakers are twice as efficient', 400)
        ]),
        new Building('Fractal Engine', 'fractal-engine', 'fa-sticky-note', 310000000000000000, 150000000000, [
            new Upgrade('Metabakeries', 3100000000000000000, 'Fractal engines are twice as efficient', 1),
            new Upgrade('Mandelbrown sugar', 15500000000000000000, 'Fractal engines are twice as efficient', 5),
            new Upgrade('Fractoids', 155000000000000000000, 'Fractal engines are twice as efficient', 25),
            new Upgrade('Nested universe theory', 15500000000000000000000, 'Fractal engines are twice as efficient', 50),
            new Upgrade('Menger sponge cake', 1550000000000000000000000, 'Fractal engines are twice as efficient', 100),
            new Upgrade('One particularly good-humoured cow', 155000000000000000000000000, 'Fractal engines are twice as efficient', 150),
            new Upgrade('Chocolate ouroboros', 155000000000000000000000000000, 'Fractal engines are twice as efficient', 200),
            new Upgrade('Nested', 155000000000000000000000000000000, 'Fractal engines are twice as efficient', 250),
            new Upgrade('Space-filling fibers', 155000000000000000000000000000000000, 'Fractal engines are twice as efficient', 300),
            new Upgrade('Endless book of prose', 155000000000000000000000000000000000000, 'Fractal engines are twice as efficient', 350),
            new Upgrade('The set of all sets', 1550000000000000000000000000000000000000000, 'Fractal engines are twice as efficient', 400)
        ]),
        new Building('Java Console', 'java-console', 'fa-sticky-note', 71000000000000000000, 1100000000000, [
            new Upgrade('The JavaScript console for dummies', 710000000000000000000, 'Java consoles are twice as efficient', 1),
            new Upgrade('64bit Arrays', 3550000000000000000000, 'Java consoles are twices as efficient', 5),
            new Upgrade('Stack overflow', 35500000000000000000000, 'Java consoles are twice as efficient', 25),
            new Upgrade('Enterprise compiler', 3550000000000000000000000, 'Java consoles are twice as efficient', 50),
            new Upgrade('Syntactic sugar', 355000000000000000000000000, 'Java consoles are twice as efficient', 100),
            new Upgrade('A nice cup of coffee', 35500000000000000000000000000, 'Java consoles are twice as efficient', 150),
            new Upgrade('Just-in-time baking', 35500000000000000000000000000000, 'Java consoles are twice as efficient', 200),
            new Upgrade('cookies++', 35500000000000000000000000000000000, 'Java consoles are twice as efficient', 250),
            new Upgrade('Software updates', 35500000000000000000000000000000000000, 'Java consoles are twice as efficient', 300),
            new Upgrade('Game.Loop', 35500000000000000000000000000000000000000, 'Java consoles are twice as efficient', 350),
            new Upgrade('eval()', 355000000000000000000000000000000000000000000, 'Java consoles are twice as efficient', 400)
        ])
        */
    ],
    utilities: {
        ShortNumbers: ['K', 'M', 'B', 'T', 'Qua', 'Qui', 'Sex', 'Sep', 'Oct', 'Non', 'Dec', 'Und', 'Duo', 'Tre', 'QuaD', 'QuiD', 'SexD', 'SepD', 'OctD', 'NonD', 'Vig'],
        updateText (className, text) {
            let elements = document.getElementsByClassName(className);
            for(var i in elements) {
                elements[i].innerHTML = text;
            }
        },
        formatNumber (number) {
            let formatted = '';
            if (number >= 1000) {
                for (let i = 0; i < game.utilities.ShortNumbers.length; i++) {
                    let divider = Math.pow(10, (i + 1) * 3)
                    if (number >= divider) {
                        formatted = (Math.trunc((number / divider) * 1000) / 1000).toFixed(4) + ' ' + game.utilities.ShortNumbers[i];
                    }
                }
                return formatted;
            }
            //return (Math.trunc(number * 10) / 10).toFixed(3);
            return number.toFixed(4);
        },
        getBuildingByName (name) {
            let correctBuilding = null;
            game.buildings.forEach(building => {
                if (building.name == name) {
                    correctBuilding = building;
                    return;
                }
            });
            return correctBuilding;
        },
        getBuildingIndexByName (name) {
            for (let i = 0; i < game.buildings.length - 1; i++) {
                let curBuilding = game.buildings[i];
                if (curBuilding.name == name) {
                    return i;
                }
            }
        },
        getBuildingCount () {
            let amount = 0;
            game.buildings.forEach(building => {
                amount += building.amount;
            });
            return amount;
        },
        stringToBool (string) {
            switch (string) {
                case 'true':
                    return true;
                case 'false':
                    return false;
            }
        }
    },
    saving: {
        export () {
            let saveString = '';
            saveString += `${game.player.cookies}|${game.player.cookieStats.Earned}|${game.player.cookieStats.Spent}|${game.player.cookieStats.Clicked}-`;
            let first = true;
            game.buildings.forEach(building => {
                if (first) {
                    first = false;
                    saveString += `${building.amount}|${building.locked}|`;
                } else {
                    saveString += `#${building.amount}|${building.locked}|`;
                }
                building.upgrades.forEach(upgrade => {
                    saveString += `${upgrade.owned}:`;
                });
                saveString = saveString.slice(0, -1);
            });
            game.saving.saveToCache(premagic(saveString));
            return premagic(saveString);
        },
        import (saveString) {
            saveString = magic(saveString);
            if (saveString != false) {
                saveString = saveString.split('-');
                game.saving.loadPlayer(saveString[0]);
                game.saving.loadBuildings(saveString[1]);
                game.settings.recalculateCPS = true;
                game.updateShop(game.currentShop);
            } else {
                alert('Something wasn\'t quite right there, unfortunately your save could not be loaded.');
            }
        },
        saveToCache (saveString) {
            try {  return window.localStorage.setItem(game.settings.key, saveString); } catch { console.log('Problem saving to cache'); }
        },
        getSaveFromCache () {
            try {  return window.localStorage.getItem(game.settings.key); } catch { console.log('Problem loading data from cache, probably doesn\'t exist'); }
        },
        loadPlayer (playerData) {
            playerData = playerData.split('|');
            try {
                game.player.cookies = parseFloat(playerData[0]);
                game.player.cookieStats.Earned = parseFloat(playerData[1]);
                game.player.cookieStats.Spent = parseFloat(playerData[2]);
                game.player.cookieStats.Clicked = parseFloat(playerData[3]);
            } catch { console.log('Something went wrong whilst loading player data, likely from an older version and not to worry.') }
        },
        loadBuildings (buildingData) {
            buildingData = buildingData.split('#');
            try {
                for (let i = 0; i < game.buildings.length; i++) {
                    let savedBuilding = buildingData[i];
                    let nonUpgrade = savedBuilding.split('|');
                    let building = game.buildings[i];
                    building.amount = parseFloat(nonUpgrade[0]);
                    building.setCost();
                    building.locked = game.utilities.stringToBool(nonUpgrade[1]);
                    let j = 0;
                    let upgrades = nonUpgrade[2].split(':');
                    building.upgrades.forEach(upgrade => {
                        upgrade.owned = game.utilities.stringToBool(upgrades[j]);
                        j++;
                    });
                }
            } catch { console.log('Something went wrong whilst loading building data, likely from an older version and not to worry.') }
        },
        wipeSave() {
            if (confirm('Are you sure you want to wipe your save? This cannot be reversed!')) {
                game.player.cookies = 0;
                game.player.cookieStats.Earned = 0;
                game.player.cookieStats.Spent = 0;
                game.player.cookieStats.Clicked = 0;
                game.buildings.forEach(building => {
                    if (building.name != 'Essence Vortex') {
                        building.locked = true;
                    }
                    building.amount = 0;
                    building.effect = 0;
                    building.specialCPS = 0;
                    building.setCost();
                    for(var i in building.upgrades) {
                        building.upgrades[i].owned = false;
                    }
                });
                game.constructShop();
                game.updateShop('Essence Vortex');
                game.settings.recalculateCPS = true;
            }
        },
        sysAddCookies() {
          game.player.cookies += 555555000;
              //$( "#upgrade6" ).css("color", "red");
              //$( "#upgrade9" ).addClass( "text-red-now" );
              //console.log("TRY")
        },
        importing: false,
        openBox(type) {
            let container = document.getElementsByClassName('importExportBox')[0];
            let box = document.getElementById('saveBox');
            switch(type) {
                case 'import':
                    this.importing = true;
                    container.style.visibility = 'visible';
                    box.removeAttribute('readonly');
                    box.value = '';
                    return;
                case 'export':
                    let saveString = this.export();
                    container.style.visibility = 'visible';
                    box.value = saveString;
                    box.setAttribute('readonly', true);
                    return;
            }
        },
        closeBox () {
            document.getElementsByClassName('importExportBox')[0].style.visibility = 'hidden';
            if (this.importing) {
                let box = document.getElementById('saveBox');
                this.import(box.value);
                box.value = '';
            }
        }
    },
    player: new Player(),
    logic () {
        game.updateDisplays();

        // Only recalculate it when needed, saves on some processing power because this can turn out to be quite a lot of maths.
        if (game.settings.recalculateCPS == true) {
            let CPS = 0;
            game.buildings.forEach(building => {
                CPS += building.getCPS();
            });

            game.settings.recalculateCPS = false;
            game.player.aMPF = CPS / game.settings.frameRate;
            game.player.upgradesAvaliable = 0;
            game.updateShop(game.currentShop);
            game.constructShop();
        }
        if (document.hasFocus()) {
            game.player.earnCookie(game.player.aMPF);
            game.saving.export();
            setTimeout(game.logic, 1000 / game.settings.frameRate);
        } else {
            game.player.earnCookie(game.player.aMPF * game.settings.frameRate);
            game.saving.export();
            setTimeout(game.logic, 1000);
        }
    },
    updateDisplays () {
        // Create temporary shorthand aliases for ease of use.
        let updateText = game.utilities.updateText;
        let format = game.utilities.formatNumber;
        let player = game.player;
        let stats = player.cookieStats;
        let buildings = game.buildings;

        document.title = 'Forever Shapes - ' + format(player.cookies);
        updateText('cookieDisplay', '' + format(player.cookies));
        updateText('cpcDisplay', format(player.aMPC));
        updateText('cpsDisplay', format(player.aMPF * game.settings.frameRate));
        updateText('earnedDisplay', format(stats.Earned));
        updateText('spentDisplay', format(stats.Spent));
        updateText('clickedDisplay', format(stats.Clicked));

        buildings.forEach(building => {
          if (building.locked == false) {
            if (game.utilities.getBuildingByName(building.name).getBuyCheck(building.name) == true){
              //console.log('RETURN TRUE');
              $( "#" + building.id ).removeClass("option-disabled");
            } else{
              //console.log('RETURN FALSE');
              $( "#" + building.id ).addClass("option-disabled");
            }
            //CYCLE THROUGH UPGRADES TOO
            building.upgrades.forEach(upgrade => {
                if (upgrade.owned == false) {
                  if (upgrade.requirementMet(building.amount)) {
                    if (upgrade.cost > game.player.cookies){
                      $( "#" + upgrade.id ).addClass("option-disabled");
                    } else {
                      $( "#" + upgrade.id ).removeClass("option-disabled");
                    }
                  }
                }
            });
          }
        });

    },
    constructShop () {
        let buildings = game.buildings;
        let finalHtml = '';
        buildings.forEach(building => {
            if (building.locked == false) {
                finalHtml += building.generateMenuButton();
            }
        });
        game.utilities.updateText('shopList', finalHtml);
    },

    currentShop: 'Essence Vortex',
    updateShop (name) {
        game.currentShop = name;
        let finalHtml = '';
        let building = game.utilities.getBuildingByName(name);
        game.buildings.forEach(building => {
            //FIX - this loops 2 times
            console.log(building.name + " ");
            finalHtml += game.utilities.getBuildingByName(building.name).generateUpgradeButtons(building.name);
            game.utilities.getBuildingByName(building.name).getBuyCheck(building.name);
        });
        game.utilities.updateText('shop', finalHtml);

        //game.checkBuyOk(building.name);
    },
    buyBuilding (name, amount) {
        let building = game.utilities.getBuildingByName(name);
        building.buy(amount);
    },
    buyUpgrade (buildingName, upgrade) {
        let building = game.utilities.getBuildingByName(buildingName);
        building.buyUpgrade(upgrade);
    },
    checkBuyOk(buildingName) {

        let html = '';
        let notMet = false;
        let upgradeSameCount = 0;
        let disabledText = '';
        this.upgrades.forEach(upgrade => {
            let format = game.utilities.formatNumber;
            if (upgrade.owned == false) {
                if (upgrade.requirementMet(this.amount)) {
                  if (upgrade.cost > game.player.cookies){
                    $( "#" + upgrade.id ).css("color", "red");
                    console.log("HELP HELP HELP")
                  }
                }
            }
        });
    },
    start () {
        // This prevents the user from holding down enter to click the cookie very quickly.
        window.addEventListener('keydown', () => {
            if (event.keyCode == 13 || event.keyCode == 32) {
                event.preventDefault();
                return false;
            }
        });

        // This enables the cookie clicking process.
        //document.getElementsByClassName('cookieButton')[0].onclick = () => {
        //    game.player.clickCookie()
        //};

        let localSave = game.saving.getSaveFromCache();
        if (localSave) {
            game.saving.import(localSave);
        } else {
            console.log('No cache save found');
        }

        game.constructShop();
        game.logic();
    }
}

game.start();
