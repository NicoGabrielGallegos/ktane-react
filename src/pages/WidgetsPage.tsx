import React from 'react'
import BatteriesController, { getBatteries } from '../components/widgets/batteries/BatteriesController.tsx'
import PortsController from '../components/widgets/ports/PortsController.tsx'
import IndicatorsController, { getIndicators } from '../components/widgets/indicators/IndicatorsController.tsx'
import SerialNumberController, { getSerialNumber } from '../components/widgets/serial_number/SerialNumberController.tsx'

const vanilla_serial_number = "AAAAA0"

const vanilla_batteries = [
  {type: "AA", quantity: 0},
  {type: "D", quantity: 0},
]

const vanilla_ports = [
  {type: "DVI-I", quantity: 0},
  {type: "Parallel", quantity: 0},
  {type: "PS/2", quantity: 0},
  {type: "RJ-45", quantity: 0},
  {type: "Serial", quantity: 0},
  {type: "Stereo RCA", quantity: 0},
]

const vanilla_indicators = []

const stored_serial_number = getSerialNumber().value
const stored_batteries = getBatteries().value
const stored_ports = JSON.parse(sessionStorage.getItem("ports") || JSON.stringify(vanilla_ports))
const stored_indicators = getIndicators().value

export default function WidgetsPage() {
  return (
    <>
      <SerialNumberController serialNumber={stored_serial_number} />
      <br />
      <BatteriesController batteries={stored_batteries} />
      <br />
      <PortsController ports={stored_ports} />
      <br />
      <IndicatorsController indicators={stored_indicators} />
    </>
  )
}
