
import { useEffect, useRef } from 'react'
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint, Composite } from 'matter-js'

function App(props) {
  const scene = useRef()
  const isPressed = useRef(false)
  const engine = useRef(Engine.create())

  engine.current.gravity = {
    x: 0,
    y: -5,
    scale: 0
  }

  engine.current.velocityIterations = 4
  engine.current.positionIterations = 6
  engine.current.constraintIterations = 2

  let count = 0;

  useEffect(() => {
    const cw = document.body.clientWidth
    const ch = document.body.clientHeight

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent'
      }
    })

    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true, restitution: 1.2 }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true, restitution: 1.2 }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true, restitution: 1.2 }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true, restitution: 1.2 })
    ])

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });
    Composite.add(engine.current.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: cw, y: ch }
    });

    Runner.run(engine.current)
    Render.run(render)

    return () => {
      Render.stop(render)
      World.clear(engine.current.world)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [])

  const handleDown = () => {
    isPressed.current = true
  }

  const handleUp = () => {
    isPressed.current = false
  }

  const handleAddCircle = e => {
    count++;
    if (count > 40) return
    console.log(isPressed)
    if (!isPressed.current) {
      const ball = Bodies.circle(
        e.clientX,
        e.clientY,
        10 + Math.random() * 30,

        {
          mass: 10,
          frictionAir: 0.01,
          density: 0.001,
          frictionStatic: 0.5,
          restitution: 1.2,
          friction: 0.1,
          id: `id-${count}`,
          force: {
            x: 0.5,
            y: 0.6
          },
          render: {
            fillStyle: '#000'
          }
        })
      World.add(engine.current.world, [ball])
    }
  }

  return (
    <div
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleAddCircle}
    >
      <div ref={scene} style={{ width: '100%', height: '600px' }} />
    </div>
  )
}

export default App;

// import * as React from "react";
// import {
//   Engine,
//   RenderClones,
//   Walls,
//   Rectangle,
//   Circle,
//   Constraint
// } from "react-matter-js";
// import { Global, css } from "@emotion/core";

// const App = () => {
//   const width = 600;
//   const height = 400;
//   return (
//     <div>
//       <Global
//         styles={css`
//           body {
//             background: #111;
//           }
//         `}
//       />
//       <Engine options={{
//         world:{
//           gravity:{
//             x:0,
//             y:-5,
//             scale:0.001
//           }
//         }
//       }}>
//         <RenderClones
//           enableMouse
//           options={{
//             width,
//             height,
//             background: "transparent",
//             wireframeBackground: "transparent"
//           }}
//         >
//           <Walls x={0} y={0} width={width} height={height} wallWidth={20} />
//           <Circle
//             clone
//             x={500}
//             y={100}
//             radius={50}
//             className={css``}
//             cloneClass={css`
//               fill: #f06;
//             `}
//           />
//           <Constraint>
//             <Circle clone x={100} y={100} radius={30} />
//             <Rectangle clone x={300} y={100} width={100} height={100} />
//           </Constraint>
//         </RenderClones>
//       </Engine>
//       <div>
//         <a href="https://github.com/slikts/react-matter-js">react-matter-js</a>
//       </div>
//     </div>
//   );
// };

// export default App;
