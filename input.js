#!/usr/bin/env node
'use strict'

const K = value => fn => { fn(value); value }
const midi = require('midi')

const decode = data => {

}

K(new midi.input())(input => {
  for(var i = 0; i < input.getPortCount(); i++) {
    console.log(`input ${i}:  ${input.getPortName(i)}`)
  }

  input.on('message', function(deltaTime, message) {
    const hex = b => {
      const s = b.toString(16).toUpperCase()
      return s.length === 1 ? '0' + s : s
    }

    const m = message.map(b => `0x${hex(b)}`).join(', ')
    console.log('length', message.length)
    console.log(m)
  })

  input.openPort(0)

  // Sysex, timing, and active sensing messages are ignored
  // by default. To enable these message types, pass false for
  // the appropriate type in the function below.
  // Order: (Sysex, Timing, Active Sensing)
  input.ignoreTypes(false, false, false);
})

const program = [
  0xF0, 0x42, 0x30, 0x00, 0x01, 0x41, // Exclusive Header
  0x4C,                               // Function Code: PROGRAM DATA DUMP
  0x00,                               // (reserved)
  0x07,                               // Programm Number

  // (8 * 7) + 6 Bytes
  0x00, 0x56, 0x4F, 0x58, 0x20, 0x43, 0x52, 0x55,
  0x00, 0x4E, 0x43, 0x48, 0x20, 0x58, 0x58, 0x58,
  0x00, 0x20, 0x20, 0x03, 0x04, 0x07, 0x4E, 0x3B,
  0x00, 0x32, 0x27, 0x42, 0x38, 0x5A, 0x01, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x04, 0x19, 0x5A, 0x32,
  0x20, 0x00, 0x00, 0x00, 0x00, 0x06, 0x4C, 0x01,
  0x00, 0x00, 0x18, 0x00, 0x2B, 0x1E, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0xF7                                // End of Exclusive
]

K(new midi.output())(output => {
  for(var i = 0; i < output.getPortCount(); i++) {
    console.log(`output ${i}:  ${output.getPortName(i)}`)
  }

  output.openPort(0)
  const FC_CURRENT_PROGRAM_DATA_DUMP_REQUEST = 0x10
  const FC_PROGRAM_DATA_DUMP_REQUEST = 0x1c
  const FC_MODE_CHANGE = 0x4E
  const FC_PROGRAM_WRITE_REQUEST = 0x11

  const DEVICE_INQUIRY_MESSAGE_REQUEST =  [0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]
  const PROGRAM_DATA_DUMP_REQUEST = pn => [0xf0, 0x42, 0x30, 0x00, 0x01, 0x41, FC_PROGRAM_DATA_DUMP_REQUEST, 0x00, pn, 0xf7]
  const MODE_CHANGE = (mode, pn) =>       [0xf0, 0x42, 0x30, 0x00, 0x01, 0x41, FC_MODE_CHANGE, mode, pn, 0xf7]
  const PROGRAM_WRITE_REQUEST = pn =>     [0xf0, 0x42, 0x30, 0x00, 0x01, 0x41, FC_PROGRAM_WRITE_REQUEST, 0x00, pn, 0xf7]

  // output.sendMessage(program)
})
