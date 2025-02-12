import { useState, useRef, ReactNode } from "react"
import Draggable, { DraggableEvent, DraggableData } from "react-draggable"

export function useDraggableModal() {
  const [disabled, setDisabled] = useState(true)
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef<HTMLDivElement>(null!)

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  }

  return {
    modalRender: (modal: React.ReactNode) => (
      <Draggable
        disabled={disabled}
        bounds={bounds}
        nodeRef={draggleRef}
        onStart={(event, uiData) => onStart(event, uiData)}
      >
        <div ref={draggleRef}>{modal}</div>
      </Draggable>
    ),
    ModalTitle: ({ children }: { children: ReactNode }) => (
      <div
        style={{ width: "100%", cursor: "move" }}
        onMouseOver={() => {
          if (disabled) {
            setDisabled(false)
          }
        }}
        onMouseOut={() => {
          setDisabled(true)
        }}
        onFocus={() => {}}
        onBlur={() => {}}
      >
        {children}
      </div>
    ),
  }
}
