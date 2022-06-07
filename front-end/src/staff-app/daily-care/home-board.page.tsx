import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { faSort } from "@fortawesome/free-solid-svg-icons"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortStudentsByFirstName, setSortStudentsByFirstName] = useState('asc')
  const [sortStudentsByLastName, setSortStudentsByLastName] = useState('asc')
  const [students, setStudents] = useState([])

  const [allCount, setAllCount] = useState(0)
  const [presentCount, setPresentCount] = useState(0)
  const [lateCount, setLateCount] = useState(0)
  const [absentCount, setAbsentCount] = useState(0)

  const [updatedStudents, setUpdatedStudents] = useState([])
  const [activeSort, setActiveSort] = useState('')

  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRolls, saveRollData, loadRollState] = useApi<{ updatedStudents: Person[] }>({ url: "save-roll" })
  const navigate = useNavigate();

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (data) {
      setStudents(data.students)
      setUpdatedStudents(data.students)
    }
  }, [data])
  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort-firstName") {
      setActiveSort('first_name')
      sortStudents('first_name')
    }
    if (action === "sort-lastName") {
      sortStudents('last_name')
      setActiveSort('last_name')
    }
  }
  const sortStudents = (item: string) => {
    let firstParam, secondParam
    if (item == 'first_name') {
      firstParam = sortStudentsByFirstName == 'asc' ? 1 : -1
      secondParam = sortStudentsByFirstName == 'asc' ? -1 : 1
    } else {
      firstParam = sortStudentsByLastName == 'asc' ? 1 : -1
      secondParam = sortStudentsByLastName == 'asc' ? -1 : 1
    }

    let sortedStudents = students.sort((a: {}, b: {}) => a[item] > b[item] ? firstParam : secondParam)
    setStudents(sortedStudents)
    if (item == 'first_name') {
      if (sortStudentsByFirstName == 'asc') {
        setSortStudentsByFirstName('desc')
      } else {
        setSortStudentsByFirstName('asc')
      }
    } else {
      if (sortStudentsByLastName == 'asc') {
        setSortStudentsByLastName('desc')
      } else {
        setSortStudentsByLastName('asc')
      }
    }
  }

  const handleRollFilter = (param) => {
    if (param === 'all') {
      setStudents(updatedStudents)
    } else {
      setStudents(updatedStudents.filter((item) => item.roll === param))
    }
  }

  const handleSaveRoll = () => {
    let updatedParams = updatedStudents.map((item, i) => {
      return { student_id: item.id, roll_state: item.roll }
    })
    saveRolls(updatedParams)
    navigate("/staff/activity")
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
    if (action === "complete") {
      handleSaveRoll()
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar activeSort={activeSort} data={data} setStudents={setStudents} onItemClick={onToolbarAction} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && students && (
          <>
            {students && students.map((s) => (
              <StudentListTile
                allCount={allCount}
                presentCount={presentCount}
                lateCount={lateCount}
                absentCount={absentCount}
                setAllCount={setAllCount}
                setPresentCount={setPresentCount}
                setLateCount={setLateCount}
                setAbsentCount={setAbsentCount}
                updatedStudents={updatedStudents}
                setUpdatedStudents={setUpdatedStudents}
                key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        allCount={allCount}
        presentCount={presentCount}
        lateCount={lateCount}
        absentCount={absentCount}
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
        handleRollFilter={handleRollFilter}
      />
    </>
  )
}

type ToolbarAction = "roll" | "sort-firstName" | "sort-lastName"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, setStudents, data, activeSort } = props
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    const searchResult = data.students && data.students.filter(item => item?.first_name?.toUpperCase().includes(value.toUpperCase()) || item?.last_name?.toUpperCase().includes(value.toUpperCase()))
    setStudents(searchResult)
  }

  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort-firstName")} style={{ color: (activeSort == 'first_name') ? 'yellow' : '' }}>First Name <FontAwesomeIcon icon={faSort} size="1x" /></div>
      <div onClick={() => onItemClick("sort-lastName")} style={{ color: (activeSort == 'last_name') ? 'yellow' : '' }}>Last Name <FontAwesomeIcon icon={faSort} size="1x" /></div>
      <S.Input placeholder="search.." type='text' onChange={(e) => handleSearch(e)} value={search} name="search" ></S.Input>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer >
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Input: styled.input`
  width: 30%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
