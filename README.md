# Typescript_read_files
 Typescript_read_files is an open source project, which is intended to show how to read data from a txt file, process and test it.
## Define the problem
The goal of this exercise is to output a table containing pairs of employees and how often they have coincided in the office.
- All data should be contained in a .txt file
- The the employee's name is required
- The calendar should show the day and time the employee was in the office.
- Time should be expressed in hours
## Define structure of input data
The input data will be structured as follow example
```
INPUT
ASTRID=MO10:00-12:00,TH12:00-14:00,SU20:00-21:00
ANDRES=MO10:00-12:00,TH12:00-14:00,SU20:00-21:00
INPUT
RENE=MO10:15-12:00,TU10:00-12:00,TH13:00-13:15
ASTRID=MO10:00-12:00,TH12:00-14:00,SU20:00-21:00
```
As is evident, each piece of data is separated by a specific word or character.
|  Set  | Row | Name | Date | Interval |
|-------|-----|------|------|----------|
|INPUT\n| \n  |  =   |   ,  |    -     |
It is necessary to consider that although the line break is not visible, it is interpreted with the character `\n` o "line break".

In addition, the day and interval are not separated by any character, so it is necessary to define a name with a defined length or they will not be separable. In this occasion it has been defined as follows

| Monday | Tuesday | Wednesday | Thursday | Friday |
|--------|---------|-----------|----------|--------|
|  MO    |    TU   |    WE     |    TH    |  FR    |

this does not mean that it cannot change, you could define month and number of day of the month as MMDD and as long as the length is the same the method should work with some minimum configuration.
## Define main method
The minimum inputs required are:
- A path:
  - **Relative:** ../data/name.tx
  - **Absolute:**: /usr/directory/name.tx

Just one output is expected and there is an Array whit the solution
- **Solution**: `[{RENE-ASTRID:1}]`
  - the solution is an object whose identifier will be the union of both names and its value will be the total of days that both met in the office.
## Steps to solving
```typescript
const main = (filePath: string) => {
  //Read file and extract data
  const dataString = readFile(filePath);
  //Check if error exist
  if (!dataString) return [{error:"Check the file name or path please"}];
  //Transform data string to object
  const dataList = transformData(dataString);

  //Processing data
  const output = dataList
    .map((data) => compareObjects(data, intersectObjects))
    .map((data) => formatData(data));
  return output;
};
```
### Data String to Object
The `transformData` method aims to obtain an array of nested objects. Starting from a string of data similar to the following example 
```
INPUT
ASTRID=MO10:00-12:00
ANDRES=MO10:00-12:00
```
```typescript
[{
  ASTRID:{MO:["10:00","12:00"]}, 
  ANDRES:{MO:["10:00","12:00"]}
}]
```  
Being an array it will be easy to iterate each set of data. And each object will keep the same structure making them comparable and facilitating the data search.
### Data Processing
Once the data is structured, a 3-step comparison is performed.
#### Data matching
Starting from an array of keys, we iterate the same array twice, but in the internal iteration we only iterate from the next element avoiding repetitions.
```typescript
const listOfCoincidences = keysArray.reduce(
    (acc: dataObject[], key, index) => {
      const { KEYS_JOINER } = config;
      //iterate from the next element of the list
      const parKeys = keysArray.slice(index + 1).map((keyNext) => ({
        //Combine the keys of the both objects
        [key + KEYS_JOINER + keyNext]: action(data[key], data[keyNext]),
      }));
      //combining all objects in the same array 
      return [...acc, ...parKeys];
    },
    []
  );
```
### Intersection of string arrays
From the two key arrays, we take one and transform it to a Set which allows us to search directly for the element. And keep the other array since we can iterate over it with filter and combine it with the has method which returns true if the element is found without iterating the whole array.
```typescript
const intersectArrays = (
  firstKeysArray: string[],
  secondKeysArray: string[]
) => {
  const setOfStrings = new Set(secondKeysArray);
  return firstKeysArray.filter((element) => setOfStrings.has(element));
};
```
### Time interval intersection
From the list of days generated above, you can iterate through it and compare only the days on which both employees were in the office. Transforming the strings into numbers from only the necessary data. And interleave them by calculating the interval between them.
```typescript
const intersectIntervals = (
  firstTree: dataObject,
  secondTree: dataObject,
  keysToCompare: string[]
) =>
  keysToCompare.reduce((acc: number, key) => {
    const firstInterval = toNumberArray(firstTree[key]);
    const secondInterval = toNumberArray(secondTree[key]);

    const interceptionOfIntervals =
      Math.min(firstInterval[1], secondInterval[1]) -
      Math.max(firstInterval[0], secondInterval[0]);

    return interceptionOfIntervals >= 0 ? acc + 1 : acc;
  }, 0);
```
If this interval is positive, it means that there was a period of time when both employees were in the office. 
```
INPUT
ANDRES=MO10:00-12:00
ASTRID=MO11:00-13:00

FI_start       SI_start   FI_end       SI_end
|--------------------|_____|--------------|
10:00              11:00 12:00          13:00

min(12:00,13:00)-max(10:00,11:00)=12:00-11:00=1h
```

## Available Scripts
In the project directory, you can run:
### `npm install`

After clone the repository, it is necessary to install the dependencies.

### `npm run dev`

For execute the project, Directly as typescript code using ts-node-dev in the background

### `npm run test`

Launches jest test runner in the interactive watch mode. They will be executed automatically when a push is performed from the local repository.

### `npm run build`

Compile the typescript code to a compatible syntax with nodejs version 12 or higher. this command will run 2 processes, one before compilation and one after.

### `npm run start`

Will execute the compiled code directly with nodejs, it is necessary to previously execute the command npm run build
