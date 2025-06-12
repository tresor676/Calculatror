"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Component() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [memory, setMemory] = useState(0)
  const [isDegreeMode, setIsDegreeMode] = useState(true)
  const [history, setHistory] = useState<string[]>([])

  const inputNumber = useCallback(
    (num: string) => {
      if (waitingForOperand) {
        setDisplay(num)
        setWaitingForOperand(false)
      } else {
        setDisplay(display === "0" ? num : display + num)
      }
    },
    [display, waitingForOperand],
  )

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }, [display, waitingForOperand])

  const clear = useCallback(() => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [])

  const clearEntry = useCallback(() => {
    setDisplay("0")
  }, [])

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }, [display])

  const toRadians = (degrees: number) => degrees * (Math.PI / 180)
  const toDegrees = (radians: number) => radians * (180 / Math.PI)

  const performCalculation = useCallback(
    (nextOperation?: string) => {
      const inputValue = Number.parseFloat(display)

      if (previousValue === null) {
        setPreviousValue(inputValue)
      } else if (operation) {
        const currentValue = previousValue || 0
        let result: number

        switch (operation) {
          case "+":
            result = currentValue + inputValue
            break
          case "-":
            result = currentValue - inputValue
            break
          case "*":
            result = currentValue * inputValue
            break
          case "/":
            result = inputValue !== 0 ? currentValue / inputValue : 0
            break
          case "^":
            result = Math.pow(currentValue, inputValue)
            break
          case "mod":
            result = currentValue % inputValue
            break
          default:
            return
        }

        setDisplay(String(result))
        setPreviousValue(result)
        setHistory((prev) => [...prev, `${currentValue} ${operation} ${inputValue} = ${result}`])
      }

      setWaitingForOperand(true)
      setOperation(nextOperation || null)
    },
    [display, previousValue, operation],
  )

  const performScientificFunction = useCallback(
    (func: string) => {
      const inputValue = Number.parseFloat(display)
      let result: number

      switch (func) {
        case "sin":
          result = Math.sin(isDegreeMode ? toRadians(inputValue) : inputValue)
          break
        case "cos":
          result = Math.cos(isDegreeMode ? toRadians(inputValue) : inputValue)
          break
        case "tan":
          result = Math.tan(isDegreeMode ? toRadians(inputValue) : inputValue)
          break
        case "asin":
          result = Math.asin(inputValue)
          result = isDegreeMode ? toDegrees(result) : result
          break
        case "acos":
          result = Math.acos(inputValue)
          result = isDegreeMode ? toDegrees(result) : result
          break
        case "atan":
          result = Math.atan(inputValue)
          result = isDegreeMode ? toDegrees(result) : result
          break
        case "log":
          result = Math.log10(inputValue)
          break
        case "ln":
          result = Math.log(inputValue)
          break
        case "sqrt":
          result = Math.sqrt(inputValue)
          break
        case "x²":
          result = Math.pow(inputValue, 2)
          break
        case "x³":
          result = Math.pow(inputValue, 3)
          break
        case "1/x":
          result = inputValue !== 0 ? 1 / inputValue : 0
          break
        case "x!":
          result = inputValue >= 0 ? factorial(Math.floor(inputValue)) : 0
          break
        case "±":
          result = -inputValue
          break
        case "abs":
          result = Math.abs(inputValue)
          break
        case "exp":
          result = Math.exp(inputValue)
          break
        default:
          return
      }

      setDisplay(String(result))
      setWaitingForOperand(true)
      setHistory((prev) => [...prev, `${func}(${inputValue}) = ${result}`])
    },
    [display, isDegreeMode],
  )

  const factorial = (n: number): number => {
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }

  const insertConstant = useCallback((constant: string) => {
    let value: number
    switch (constant) {
      case "π":
        value = Math.PI
        break
      case "e":
        value = Math.E
        break
      default:
        return
    }
    setDisplay(String(value))
    setWaitingForOperand(true)
  }, [])

  const memoryOperation = useCallback(
    (op: string) => {
      const inputValue = Number.parseFloat(display)
      switch (op) {
        case "MC":
          setMemory(0)
          break
        case "MR":
          setDisplay(String(memory))
          setWaitingForOperand(true)
          break
        case "M+":
          setMemory(memory + inputValue)
          break
        case "M-":
          setMemory(memory - inputValue)
          break
        case "MS":
          setMemory(inputValue)
          break
      }
    },
    [display, memory],
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Scientific Calculator</CardTitle>
          <div className="flex justify-center gap-2">
            <Badge variant={isDegreeMode ? "default" : "secondary"}>{isDegreeMode ? "DEG" : "RAD"}</Badge>
            {memory !== 0 && <Badge variant="outline">M</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-right text-3xl font-mono font-bold overflow-hidden">{display}</div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-8 gap-2">
            {/* Row 1 - Memory and Mode */}
            <Button variant="outline" onClick={() => memoryOperation("MC")} className="text-xs">
              MC
            </Button>
            <Button variant="outline" onClick={() => memoryOperation("MR")} className="text-xs">
              MR
            </Button>
            <Button variant="outline" onClick={() => memoryOperation("M+")} className="text-xs">
              M+
            </Button>
            <Button variant="outline" onClick={() => memoryOperation("M-")} className="text-xs">
              M-
            </Button>
            <Button variant="outline" onClick={() => memoryOperation("MS")} className="text-xs">
              MS
            </Button>
            <Button variant="outline" onClick={() => setIsDegreeMode(!isDegreeMode)} className="text-xs">
              {isDegreeMode ? "DEG" : "RAD"}
            </Button>
            <Button variant="destructive" onClick={clear} className="text-xs">
              C
            </Button>
            <Button variant="outline" onClick={clearEntry} className="text-xs">
              CE
            </Button>

            {/* Row 2 - Scientific Functions */}
            <Button variant="outline" onClick={() => performScientificFunction("sin")} className="text-xs">
              sin
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("cos")} className="text-xs">
              cos
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("tan")} className="text-xs">
              tan
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("log")} className="text-xs">
              log
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("ln")} className="text-xs">
              ln
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("x²")} className="text-xs">
              x²
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("sqrt")} className="text-xs">
              √x
            </Button>
            <Button variant="outline" onClick={backspace} className="text-xs">
              ⌫
            </Button>

            {/* Row 3 - More Scientific Functions */}
            <Button variant="outline" onClick={() => performScientificFunction("asin")} className="text-xs">
              sin⁻¹
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("acos")} className="text-xs">
              cos⁻¹
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("atan")} className="text-xs">
              tan⁻¹
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("x³")} className="text-xs">
              x³
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("1/x")} className="text-xs">
              1/x
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("x!")} className="text-xs">
              x!
            </Button>
            <Button variant="outline" onClick={() => performCalculation("^")} className="text-xs">
              xʸ
            </Button>
            <Button variant="outline" onClick={() => performCalculation("/")} className="text-lg">
              ÷
            </Button>

            {/* Row 4 - Constants and Numbers */}
            <Button variant="outline" onClick={() => insertConstant("π")} className="text-xs">
              π
            </Button>
            <Button variant="outline" onClick={() => insertConstant("e")} className="text-xs">
              e
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("exp")} className="text-xs">
              eˣ
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("abs")} className="text-xs">
              |x|
            </Button>
            <Button onClick={() => inputNumber("7")} className="text-lg">
              7
            </Button>
            <Button onClick={() => inputNumber("8")} className="text-lg">
              8
            </Button>
            <Button onClick={() => inputNumber("9")} className="text-lg">
              9
            </Button>
            <Button variant="outline" onClick={() => performCalculation("*")} className="text-lg">
              ×
            </Button>

            {/* Row 5 */}
            <Button variant="outline" onClick={() => inputNumber("(")} className="text-xs">
              (
            </Button>
            <Button variant="outline" onClick={() => inputNumber(")")} className="text-xs">
              )
            </Button>
            <Button variant="outline" onClick={() => performCalculation("mod")} className="text-xs">
              mod
            </Button>
            <Button variant="outline" onClick={() => performScientificFunction("±")} className="text-xs">
              ±
            </Button>
            <Button onClick={() => inputNumber("4")} className="text-lg">
              4
            </Button>
            <Button onClick={() => inputNumber("5")} className="text-lg">
              5
            </Button>
            <Button onClick={() => inputNumber("6")} className="text-lg">
              6
            </Button>
            <Button variant="outline" onClick={() => performCalculation("-")} className="text-lg">
              −
            </Button>

            {/* Row 6 */}
            <div className="col-span-4"></div>
            <Button onClick={() => inputNumber("1")} className="text-lg">
              1
            </Button>
            <Button onClick={() => inputNumber("2")} className="text-lg">
              2
            </Button>
            <Button onClick={() => inputNumber("3")} className="text-lg">
              3
            </Button>
            <Button variant="outline" onClick={() => performCalculation("+")} className="text-lg">
              +
            </Button>

            {/* Row 7 */}
            <div className="col-span-4"></div>
            <Button onClick={() => inputNumber("0")} className="col-span-2 text-lg">
              0
            </Button>
            <Button onClick={inputDecimal} className="text-lg">
              .
            </Button>
            <Button
              variant="default"
              onClick={() => performCalculation()}
              className="text-lg bg-blue-600 hover:bg-blue-700"
            >
              =
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {history.slice(-5).map((entry, index) => (
                <div key={index} className="text-xs font-mono text-gray-600">
                  {entry}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
