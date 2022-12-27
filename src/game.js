import { ECS } from '$/ecs';
import { EventEmitter } from '$/events';
import { loadAssets } from './assets';
import { HealthComponent } from './components/health';
import { WorldComponent } from './components/world';
import { Bug } from './entities/bug';
import { Frog } from './entities/frog';
import { Global } from './global';

async function load() {

    await loadAssets();

}

const entities = [];
let world;
let pathArray;
let spawnPoint;

async function preUpdate() {

    console.log('preupdate');

    // create/get world and level data
    console.log('setting up world and level');
    world = Global.world;
    pathArray = Global.level.pathArray;
    spawnPoint = pathArray[0];

    // create a new frog
    const frog = new Frog(world, 'frog');
    entities.push(frog);

    EventEmitter.events.on('frogEatBug', (strength) => {

        entities[1].getComponent(HealthComponent).health -= strength;
        console.log(entities[1].getComponent(HealthComponent).health);

    });

    // fill shop
    EventEmitter.events.on('shopReady', () => {

        console.log('setting up shop');
        EventEmitter.events.trigger('shopSetItem', {
            id: 'coolfrog',
            name: 'The super cool frog',
            price: 100
        });
        EventEmitter.events.trigger('shopSetItem', {
            id: 'sexyfrog',
            name: 'The super sexy frog',
            price: 120,
            callback: (itemData) => {

                console.log(itemData);

            }
        });

    });

}

const bugType = ['fly', 'spider', 'butterfly'];

let spawnTimer = 5000;

function update(delta, time) {

    for (let i = 0; i < entities.length; i++) {

        const entity = entities[i];
        if (entity.destroyed) {

            entities.splice(i, 1);

        } else {

            ECS.updateEntity(entity, delta, time);

        }

    }

    // timer to spawn bugs
    if (spawnTimer >= 5000) {

        spawnTimer -= 5000;

        const bug = new Bug(world, bugType[Math.floor(Math.random() * bugType.length)], pathArray);

        entities.push(bug);

        bug.getComponent(WorldComponent).position.set(spawnPoint.x, spawnPoint.y);

    }

    spawnTimer += delta;

}

const Game = {
    load,
    preUpdate,
    update
};

export { Game };
