# MikroORM Issue

Using assign in the constructor of the custom base entity with nested entities does not work as expected.

However, using assign in the constructor of the entity class (child of the base entity) with nested entities, works as expected.

I'd like to use this assign for my base entity constructor (so I don't have to call it all entities) and also use it to merge entities after they've been created. This makes it so I can pass DTOs (that have been validated), in order to create and update entities.

I've setup 4 following tests to show the issue.

### Entities

Base entity:

- abstract class that extends the BaseEntity from MikroOrm
- Used for shared variables

Question entity:

- extends Base entity
- has a 1:M to Option

Option entity

- extends Base Entity
- has a M:1 to Question

## in-base.test.ts

I assign the body of my DTO in the custom entity base constructor.

### Should create nested entities with assign in base

This test `fails` because it expects options to be persisted to the database. For some reason, using assign in the custom base entity constructor, does not persist the options.

### should update nested entities with assign in base

This test `succeeds` because I used the create method first, instead of the constructor, and update the object, using the same assign method.

## not-in-base.test.ts

I assign the body of my DTO in each specific entity constructor.

I've also tested leaving out the assign in the option constructor, but that does not seem to make a difference.

### should create nested entities with assign not in base

This test `succeeds` because it expects options to be persisted to the database. Which is the case, if the assign is not in the constructor of the custom base entity.

### should update nested entities with assign not in base

This test `succeeds`. I did not have to use the .create method, but just used the constructor. (because I've tested `should create nested entities with assign not in base` mentioned above)

## Setup

### Run Yarn

```
yarn
```

### Setup database

```
docker-compose up -d
```

### Run the tests

```
yarn test
```
