"use client"
import { useEffect, useRef, useState } from "react"
import { Image, Layer, Rect, Stage } from "react-konva"
import useImage from "use-image"

export default function Plan() {
  const [image] = useImage("/plan.png")
  const [scale, setScale] = useState(0.5)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight })
    })
    observer.observe(el)
    setSize({ width: el.clientWidth, height: el.clientHeight })
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.width > 0 && (
        <Stage
          width={size.width}
          height={size.height}
          x={pos.x}
          y={pos.y}
          scaleX={scale}
          scaleY={scale}
          draggable
          onDragEnd={(e) => {
            setPos({ x: e.target.x(), y: e.target.y() })
          }}
          className="cursor-grab"
        >
          <Layer>
            <Image image={image} width={1024} height={1024} />
          </Layer>

          <Layer>
            <Rect
              x={228}
              y={247}
              width={51}
              height={84}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={408}
              y={247}
              width={40}
              height={90}
              fill="#DE870A"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={654}
              y={348}
              width={22}
              height={50}
              fill="#FF0000"
              opacity={0.7}
              cornerRadius={4}
              className="!cursor-pointer"
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={728}
              y={348}
              width={22}
              height={50}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={795}
              y={348}
              width={22}
              height={50}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={795}
              y={348}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={438}
              y={440}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={512}
              y={440}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={584}
              y={440}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={656}
              y={440}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={728}
              y={440}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={795}
              y={440}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />

            <Rect
              x={438}
              y={512}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={512}
              y={512}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={584}
              y={512}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={656}
              y={512}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={728}
              y={512}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={795}
              y={512}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />

            <Rect
              x={438}
              y={584}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={512}
              y={584}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={584}
              y={584}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={656}
              y={584}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={728}
              y={584}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={795}
              y={584}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={438}
              y={658}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={512}
              y={658}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={584}
              y={658}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={656}
              y={658}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={728}
              y={658}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={795}
              y={658}
              width={22}
              height={55}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
            <Rect
              x={336}
              y={520}
              width={36}
              height={50}
              fill="#22c55e"
              opacity={0.7}
              cornerRadius={4}
              onClick={() => console.log("clicked")}
            />
          </Layer>
        </Stage>
      )}
    </div>
  )
}
