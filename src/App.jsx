import React, { useState, useEffect, useMemo, useCallback } from 'react'

// MUI component imports
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import LoadingButton from '@mui/lab/LoadingButton'
import { List, ListItem, Divider } from '@mui/material'

// Utility/function imports from project files
import { removeReskin } from './utils/removeReskin'
import {
  classRequirementLostHallsExalted,
  ensureExaltValuesArePopulated, // due to async function
  exaLHSTSets,
  exaPointsList,
  bannedItems,
  pointPenaltyItems,
} from './utils/classRequirements'

// Custom component imports
import CustomTabPanel from './components/CustomTabPanel'
import CustomScrollableList from './components/CustomScrollableList'

const charsInfo = [
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/bow-of-mystical-energy',
      'https://www.realmeye.com/wiki/cave-dweller-trap',
      'https://www.realmeye.com/wiki/leviathan-armor',
      'https://www.realmeye.com/wiki/ring-of-unbound-health',
    ],
    playerStats: '8/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/staff-of-the-vital-unity',
      'https://www.realmeye.com/wiki/lifedrinker-skull',
      'https://www.realmeye.com/wiki/robe-of-the-ancient-intellect',
      'https://www.realmeye.com/wiki/ring-of-paramount-health',
    ],
    playerStats: '8/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/fury-flail',
      'https://www.realmeye.com/wiki/golden-helm',
      'https://www.realmeye.com/wiki/candy-coated-armor',
      'https://www.realmeye.com/wiki/ring-of-paramount-health',
    ],
    playerStats: '8/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/rusty-katana',
      'https://www.realmeye.com/wiki/slashing-sheath',
    ],
    playerStats: '0/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/fury-flail',
      'https://www.realmeye.com/wiki/shield-of-orcish-regalia',
      'https://www.realmeye.com/wiki/sage-s-wakibiki',
      'https://www.realmeye.com/wiki/ring-of-decades',
    ],
    playerStats: '8/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/fury-flail',
      'https://www.realmeye.com/wiki/seal-of-the-holy-warrior',
      'https://www.realmeye.com/wiki/annihilation-armor',
      'https://www.realmeye.com/wiki/ring-of-paramount-health',
    ],
    playerStats: '8/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/aspirant-s-staff',
      'https://www.realmeye.com/wiki/genesis-spell',
      'https://www.realmeye.com/wiki/aspirant-s-robes',
      'https://www.realmeye.com/wiki/ring-of-the-stalwart',
    ],
    playerStats: '8/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/wand-of-evocation',
      'https://www.realmeye.com/wiki/cnidaria-rod',
      'https://www.realmeye.com/wiki/robe-of-the-ancient-intellect',
      'https://www.realmeye.com/wiki/bloodshed-ring',
    ],
    playerStats: '8/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/kusanagi',
      'https://www.realmeye.com/wiki/royal-wakizashi',
      'https://www.realmeye.com/wiki/kamishimo',
      'https://www.realmeye.com/wiki/thistleleaf-necklace',
    ],
    playerStats: '4/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/quartz-cutter',
      'https://www.realmeye.com/wiki/star-of-enlightenment',
      'https://www.realmeye.com/wiki/luminous-armor',
      'https://www.realmeye.com/wiki/radiant-heart',
    ],
    playerStats: '5/8',
  },
  {
    characterPicture: 'leviathan-armor',
    items: [
      'https://www.realmeye.com/wiki/steel-dagger',
      'https://www.realmeye.com/wiki/daevite-progenitor',
    ],
    playerStats: '0/8',
  },
]

const validIGN = (ign) => {
  return /^[a-zA-Z0-9]{1,17}$/.test(ign)
}

const CHAR_WIDTH = 50 // Width of one character image in the sprite sheet
const CHAR_HEIGHT = 50 // Height of one character image in the sprite sheet

function getCharacterStyle(
  base64Image,
  index,
  spriteWidth,
  spriteHeight,
  totalSprites
) {
  // Calculate the background position based on index
  const xPosition = -(spriteWidth * index)

  return {
    width: `${spriteWidth}px`, // Width of one sprite
    height: `${spriteHeight}px`, // Height of one sprite
    backgroundImage: `url(${base64Image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `${xPosition}px 0px`,
    backgroundSize: `${spriteWidth * totalSprites}px ${spriteHeight}px`, // Total width of all sprites, height of one sprite
  }
}

const calculateCharacterMessage = (character, characterResult) => {
  // calculate what text should be shown and what style (sx) should be applied
  if (character.playerStats !== '8/8') {
    return {
      message: ' NOT 8/8',
      sx: {
        color: 'red',
        // middle of up and down
      },
    }
  } else if (characterResult.result === 'banned') {
    // itemIdx
    const bannedItemName =
      character.items[characterResult.itemIdx]?.name || 'Unknown item'

    return {
      message: `${bannedItemName} is banned`,
      sx: {
        color: 'red',
      },
    }
  } else if (characterResult.result === 'insufficient points') {
    return {
      message: `Insufficient points: ${characterResult.points ?? 0}/${
        characterResult.required ?? 0
      }`,
      sx: {
        color: 'red',
      },
    }
  } else if (characterResult.result === 'no class selected') {
    return {
      message: 'No class selected',
      sx: {
        color: 'red',
      },
    }
  } else if (characterResult.result === 'ok') {
    return {
      message: `OK (${characterResult.points}/${
        characterResult.required ?? 0
      })`,
      sx: {
        color: 'green',
      },
    }
  }
}

function App() {
  const [items, setItems] = useState([])
  const [selectedWeapon, setSelectedWeapon] = useState(null)
  const [selectedAbility, setSelectedAbility] = useState(null)
  const [selectedArmor, setSelectedArmor] = useState(null)
  const [selectedRing, setSelectedRing] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [characterList, setCharacterList] = useState([])
  const [exaltDataLoaded, setExaltDataLoaded] = useState(false)
  const [characterListResults, setCharacterListResults] = useState([])
  const [characterImageSheet64, setCharacterImageSheet64] = useState(null)
  const [realmEyeIGN, setRealmEyeIGN] = useState('')
  const [fetchingData, setFetchingData] = useState(false)
  const [itemToClassDict, setItemToClassDict] = useState({})

  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const itemTypes = useMemo(() => {
    if (items.length > 0) {
      const itemTypeMap = new Map()
      for (let item of items) {
        if (item.category) {
          itemTypeMap.set(item.weaponLinkName, Number(item.category))
        }
      }
      return itemTypeMap
    }
    return new Map()
  }, [items])

  const skinlessWeapon = useMemo(
    () => removeReskin(selectedWeapon?.weaponLinkName),
    [selectedWeapon]
  )
  const skinlessAbility = useMemo(
    () => removeReskin(selectedAbility?.weaponLinkName),
    [selectedAbility]
  )
  const skinlessArmor = useMemo(
    () => removeReskin(selectedArmor?.weaponLinkName),
    [selectedArmor]
  )
  const skinlessRing = useMemo(
    () => removeReskin(selectedRing?.weaponLinkName),
    [selectedRing]
  )

  const hasItem = (item) => {
    if (item === null) return -2
    if (selectedWeapon && skinlessWeapon === item) return 0
    if (selectedAbility && skinlessAbility === item) return 1
    if (selectedArmor && skinlessArmor === item) return 2
    if (selectedRing && skinlessRing === item) return 3
    return -1
  }

  const fetchCharacterData = useCallback(
    async (realmEyeIGN) => {
      if (fetchingData) {
        return
      }
      if (!validIGN(realmEyeIGN)) {
        alert('Invalid IGN. Please enter a valid IGN.')
        return
      }

      setFetchingData(true)

      fetch(
        `http://localhost:3000/scrape?url=https://www.realmeye.com/player/${encodeURIComponent(
          realmEyeIGN
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Process the fetched data here
          setCharacterList(data.characterData)
          setCharacterImageSheet64(data.base64ImageData)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
        .finally(() => {
          setFetchingData(false)
        })
    },
    [setCharacterList, setCharacterImageSheet64]
  )

  function evaluateEquipment(gearItemInputs) {
    let equipments = [...gearItemInputs]
    for (let i = 0; i < equipments.length; i++) {
      if (equipments[i] !== null && equipments[i] !== undefined) {
        // CAUTION! Item names are translated from the wiki link to the actual item name
        const matchResult = equipments[i].match(/\/wiki\/(.*?)\/?$/)
        if (matchResult && matchResult.length > 1) {
          equipments[i] = matchResult[1]
        }
      }
      if (bannedItems.includes(equipments[i])) {
        return { result: 'banned', points: 0, itemIdx: i }
      }
    }

    let totalPoints = 0
    const pointsAssignedEquipment = [false, false, false, false]

    for (let i = 0; i < 4; i++) {
      for (let item of exaPointsList[i]) {
        if (item[0] === 'special') {
          // Special handling logic (not detailed here, please fill in)
        } else {
          const it = item[0]
          const itemType = itemTypes.get(it) - 1

          if (!equipments.includes(it) || pointsAssignedEquipment[itemType]) {
            continue
          }

          pointsAssignedEquipment[itemType] = true
          totalPoints += [5, 3, 2, 1][i] // Adjust points as necessary
        }
      }
    }

    for (let item of pointPenaltyItems) {
      if (equipments.includes(item)) {
        totalPoints-- // Deduct points for penalty items
      }
    }

    let thisCharacterClass = null
    for (let item of equipments) {
      if (item) {
        // ability
        // check if itemToClassDict is not empty
        if (
          Object.keys(itemToClassDict).length !== 0 &&
          itemToClassDict[item] != 'noclass'
        ) {
          thisCharacterClass = itemToClassDict[item]
        }
      }
    }

    if (!thisCharacterClass) {
      return { result: 'no class selected', points: totalPoints }
    }

    // check if it's a set
    let ok = false
    for (let set of exaLHSTSets) {
      ok |= equipments.every(
        (item) => item !== undefined && item !== null && set.includes(item)
      )
    }

    const requirement = classRequirementLostHallsExalted[thisCharacterClass]

    if (!ok) {
      if (totalPoints < requirement) {
        return {
          result: 'insufficient points',
          points: totalPoints,
          required: requirement,
        }
      }

      return { result: 'ok', points: totalPoints, required: requirement }
    } else {
      return { result: 'ok', points: requirement, required: requirement }
    }
  }

  useEffect(() => {
    async function fetchData() {
      await ensureExaltValuesArePopulated()
      // setCharacterList(charsInfo)
      setExaltDataLoaded(true)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (exaltDataLoaded && characterList.length > 0) {
      setCharacterListResults(
        characterList.map((character) => evaluateEquipment(character.items))
      )
    }
  }, [exaltDataLoaded, characterList])

  const characterEvaluation = useMemo(() => {
    return evaluateEquipment([
      skinlessWeapon,
      skinlessAbility,
      skinlessArmor,
      skinlessRing,
    ])
  }, [
    selectedWeapon,
    selectedAbility,
    selectedArmor,
    selectedRing,
    exaltDataLoaded,
  ])

  useEffect(() => {
    // create a dictionary of key value pairs for items (iten -> class)
    let itemClassDict = {}
    fetch(`${import.meta.env.BASE_URL}equipment_with_classes.txt`)
      .then((response) => response.text())
      .then((text) => {
        const lines = text.split('\n')
        const parsedItems = lines.reduce((acc, line) => {
          const trimmedLine = line.trim()

          if (trimmedLine) {
            const parts = trimmedLine.split(' ^ ')
            if (parts.length === 5) {
              const [imgSrc, name, link, category, characterClass] = parts
              const imageName = link.replace('/wiki/', '') + '.png'
              itemClassDict[imageName.replace('.png', '')] = characterClass
              const id = `${name}-${link}` // create a unique ID for each item
              acc.push({
                id,
                imgSrc,
                name,
                imageLocalPath: `downloaded_images/${imageName}`,
                weaponLinkName: imageName.replace('.png', ''),
                category,
                characterClass,
                link,
              })
            } else {
              console.warn('Skipping line due to incorrect format:', line)
            }
          }
          return acc
        }, [])
        setItems(parsedItems)
        setItemToClassDict(itemClassDict)
      })
      .catch((error) =>
        console.error('Error fetching or parsing the file:', error)
      )
  }, [])

  const selectItem = (item) => {
    if (!item) return
    switch (item.category) {
      case '1':
        setSelectedWeapon(item)
        break
      case '2':
        setSelectedAbility(item)
        setSelectedCharacter(item.characterClass)
        break
      case '3':
        setSelectedArmor(item)
        break
      case '4':
        setSelectedRing(item)
        break
      default:
        console.warn('Unknown category:', item.category)
    }
  }

  const customFilter = (options, { inputValue }) => {
    const words = inputValue
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)

    return options.filter((option) => {
      return words.every((word) => option.name.toLowerCase().includes(word))
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault() // Prevent the default form submit action
    if (fetchingData) return
    try {
      // Call your function to fetch data
      fetchCharacterData(realmEyeIGN)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const middleBox = () => {
    if (characterEvaluation.result === 'banned') {
      const bannedItemName =
        [selectedWeapon, selectedAbility, selectedArmor, selectedRing][
          characterEvaluation.itemIdx
        ]?.name || 'Unknown item'
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            maxWidth: '800px',
            margin: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            <span style={{ color: 'red' }}>
              {bannedItemName} is banned from an exalted Lost Halls run.
            </span>
          </Typography>
        </Paper>
      )
    } else {
      // This section handles the display when there are no banned items.
      // It checks if a character class is selected and displays points accordingly.
      if (!selectedCharacter) {
        return (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              maxWidth: '800px',
              margin: 'auto',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              <span style={{ color: 'red' }}>
                Currently {characterEvaluation.points} points for an exalted
                Lost Halls run (no class selected).
              </span>
            </Typography>
          </Paper>
        )
      } else {
        // If a character class is selected, display the points and compare with the class requirement.
        const requirement = classRequirementLostHallsExalted[selectedCharacter]
        const pointsMet = characterEvaluation.points >= requirement
        const color = pointsMet ? 'green' : 'red'
        return (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              maxWidth: '800px',
              margin: 'auto',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              <span style={{ color }}>
                Your{' '}
                <img
                  src={`class_pictures/${selectedCharacter}.png`}
                  alt={selectedCharacter}
                  style={{
                    maxWidth: '50px',
                    maxHeight: '50px',
                    margin: '0 10px',
                  }}
                />
                has {characterEvaluation.points}/{requirement} points for an
                exalted Lost Halls run {pointsMet ? ':)' : ':('}
              </span>
            </Typography>
          </Paper>
        )
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: '100%',
          p: 2,
          backgroundColor: '#006400',
          color: 'white',
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center">
          Rotmg Raid Requirement Checker
        </Typography>
      </Box>

      {/* Tabs Header */}
      <Typography
        variant="h6"
        component="h2"
        sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}
        textAlign="center"
      >
        Select a tab
      </Typography>

      {/* Tabs */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            '.MuiTabs-indicator': {
              backgroundColor: '#1976d2', // Active tab indicator color
            },
            '.MuiTab-root': {
              '&.Mui-selected': {
                color: '#1976d2', // Active tab text color
              },
              fontWeight: 'bold',
              '&:hover': {
                color: '#115293', // Tab text hover color
                opacity: 1,
              },
            },
          }}
        >
          <Tab label="Scan through realmeye IGN" />
          <Tab label="Custom select" />
        </Tabs>
      </Box>

      {/* TODO: Make tab 1 a form so searching happens by a click */}
      {/* Tab 1 Content */}
      <CustomTabPanel value={tabValue} index={0}>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <TextField
                label="Enter realmeye IGN"
                variant="outlined"
                sx={{ height: '3.5rem', width: '200px' }} // Set a specific width
                value={realmEyeIGN}
                onChange={(e) => setRealmEyeIGN(e.target.value)}
                // You might also want to include a "name" attribute here for accessibility and form handling
              />
            </Grid>
            <Grid item>
              <LoadingButton
                type="submit" // Make this button submit the form
                variant="contained"
                loading={fetchingData} // Adjust loading state as necessary
                sx={{ height: '3.5rem', width: '200px' }} // Set a specific width
              >
                Scan characters
              </LoadingButton>
            </Grid>
          </Grid>
        </form>

        {/* Ensure CustomScrollableList utilizes the sx prop internally for width control */}
        <CustomScrollableList
          characters={characterList}
          characterListResults={characterListResults}
          characterImageSheet64={characterImageSheet64}
          getCharacterStyle={getCharacterStyle}
          calculateCharacterMessage={calculateCharacterMessage}
          CHAR_WIDTH={CHAR_WIDTH}
          CHAR_HEIGHT={CHAR_HEIGHT}
        />
      </CustomTabPanel>

      {/* Tab 2 Content */}
      <CustomTabPanel value={tabValue} index={1}>
        {middleBox()}

        {/* Center the selection box */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            mt: 2,
          }}
        >
          <Box sx={{ width: 300 }}>
            {' '}
            {/* Adjust width as needed */}
            <Autocomplete
              options={items}
              getOptionLabel={(option) => option.name}
              filterOptions={customFilter}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <img
                    src={option.imageLocalPath}
                    alt={option.name}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Items"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                selectItem(newValue)
              }}
              fullWidth
            />
          </Box>
        </Box>

        {/* Display selected item images */}
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <img
              src={
                selectedWeapon
                  ? selectedWeapon.imageLocalPath
                  : `${import.meta.env.BASE_URL}gifs/weapon.gif`
              }
              alt="Selected Weapon"
              style={{ width: 80, height: 80 }} // Adjust size as needed
            />
          </Grid>
          <Grid item>
            <img
              src={
                selectedAbility
                  ? selectedAbility.imageLocalPath
                  : `${import.meta.env.BASE_URL}gifs/ability.gif`
              }
              alt="Selected Ability"
              style={{ width: 80, height: 80 }} // Adjust size as needed
            />
          </Grid>
          <Grid item>
            <img
              src={
                selectedArmor
                  ? selectedArmor.imageLocalPath
                  : `${import.meta.env.BASE_URL}gifs/armor.gif`
              }
              alt="Selected Armor"
              style={{ width: 80, height: 80 }} // Adjust size as needed
            />
          </Grid>
          <Grid item>
            <img
              src={
                selectedRing
                  ? selectedRing.imageLocalPath
                  : `${import.meta.env.BASE_URL}ring.png`
              }
              alt="Selected Ring"
              style={{ width: 80, height: 80 }} // Adjust size as needed
            />
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* Footer */}
      <Box
        sx={{
          width: '100%',
          p: 2,
          backgroundColor: '#e0e0e0',
          borderTop: '1px solid #bdbdbd',
          mt: 'auto',
        }}
      >
        <Typography variant="body2" textAlign="center" color="textSecondary">
          This app is not endorsed or affiliated with Realm of the Mad God, Deca
          Games, or any related entities. All images, data, and content related
          to Realm of the Mad God used in this app are property of their
          respective owners. This app is intended for educational and
          informational purposes only, under fair use guidelines.
          <br />
          Hosted on{' '}
          <a
            href="https://pages.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
          >
            GitHub Pages
          </a>
          .
        </Typography>
      </Box>
    </Box>
  )
}

export default App
