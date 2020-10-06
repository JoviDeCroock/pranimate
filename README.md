# pranimate

[![npm version](https://badgen.net/npm/v/pranimate)](https://www.npmjs.com/package/pranimate)
[![Bundle size](https://badgen.net/bundlephobia/minzip/pranimate)](https://badgen.net/bundlephobia/minzip/pranimate)

## Installation

```sh
npm i --save pranimate
## OR
yarn add pranimate
```

## Usage

- [Basic Example](https://codesandbox.io/s/practical-swartz-s7jx3)
- [Turning card](https://codesandbox.io/s/determined-browser-tnj90?file=/src/index.js)

### useSpring

This hook accepts an object as argument, this object can contain seven properties:

- to, the ending value where we are animating towards
- property, the name of the property we are animating
- from, the starting value where we are animating from
- getValue, this function will be invoked to get special values as seen in the example for rotate/translate
- infinite, whether or not the animation should keep animating back and forth
- lazy, whether or not the hook should start with the animation started
- preset, this can be either 'wobbly' | 'noWobble' | 'stiff' which are three spring mechanics
- velocity, by default 1 you can tweak this number to have your proper speed

The hook returns you a tuple with the first being a ref which you should attach to the element you are animating,
the second being a function that activates the animation, this can be handy when you started in the lazy mode and the
thirth being a function called play to imperatively play your animation once.

Example:

```jsx
const SpringAnimation = () => {
  const [ref] = useSpring({
    from: 0,
    to: 75,
    getValue: x => `translateX(${x}vw)`,
    property: 'transform',
    infinite: true,
  });

  return (
    <div
      ref={ref}
      style={{ backgroundColor: 'red', width: 300, height: 300 }}
    />
  );
};
```

### useMountUnmount

This hook accepts an object as argument, this object can contain four properties:

- mountedClass, the className to return when the element is mounting
- unmountedClass, the className to return when the element is unmounting
- duration, the duration of your css-animation from the above two properties.
- lazy (optional), whether or not the hook should start with a mounted false state

This hooks returns you an array with four values:

- The current className (mounting/unmounting)
- The mounted state
- A function to indicate to our hook that we are mounting
- A function to indicate to our hook that we are unmounting

Example:

```jsx
const CssAnimation = () => {
  const [className, mounted, mount, unmount] = useMountUnmount({
    mountingClass: 'mounting',
    unmountingClass: 'unmounting',
    duration: 1000,
  });

  useEffect(() => {
    setTimeout(() => {
      if (mounted) {
        unmount();
      } else {
        mount();
      }
    }, 2500);
  }, [mounted, mount, unmount]);

  return (
    mounted !== false && (
      <div
        className={className}
        style={{
          backgroundColor: 'red',
          width: 300,
          height: 300,
          marginBottom: 64,
        }}
      />
    )
  );
};
```
