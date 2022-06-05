import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, allCount, presentCount, lateCount, absentCount, setAllCount, setPresentCount, setLateCount,
  setAbsentCount, updatedStudents, setUpdatedStudents, student }) => {
  const [rollState, setRollState] = useState(initialState)

  const updateStudentRollDetail = (state) => {
    let updatedStudentsRef = updatedStudents
    updatedStudentsRef.find((item) => item.id === student.id)['roll'] = state
    setUpdatedStudents(updatedStudentsRef)
  }

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") {
      if (rollState === "absent") {
        setAbsentCount(absentCount - 1)
      } else {
        setAllCount(allCount + 1)
      }
      updateStudentRollDetail('present')
      setPresentCount(presentCount + 1)
      return states[0]
    }
    const matchingIndex = states.findIndex((s) => s === rollState)
    if (matchingIndex === 0) {
      setPresentCount(presentCount - 1)
      setLateCount(lateCount + 1)
      updateStudentRollDetail('late')
      return states[matchingIndex + 1]
    }
    if (matchingIndex === 1) {
      setLateCount(lateCount - 1)
      setAbsentCount(absentCount + 1)
      updateStudentRollDetail('absent')
      return states[matchingIndex + 1]
    }
    return states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={student.roll || rollState} size={size} onClick={onClick} />
}
