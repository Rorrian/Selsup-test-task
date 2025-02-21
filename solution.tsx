import { Fragment, useEffect, useState } from 'react'

interface Color {
  id: number
  value: string
}

interface Param {
  id: number
  name: string
  type: 'string'
}

interface ParamValue {
  paramId: number
  value: string
}

interface Model {
  paramValues: ParamValue[]
  colors: Color[]
}

interface Props {
  params: Param[]
  model: Model
}

export const mockParams: Param[] = [
  {
    id: 1,
    name: 'Назначение',
    type: 'string',
  },
  {
    id: 2,
    name: 'Длина',
    type: 'string',
  },
]

export const mockModel: Model = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное',
    },
    {
      paramId: 2,
      value: 'макси',
    },
  ],
  colors: [],
}

const isValidModel = (model: any, params: Param[]): model is Model => {
  if (
    typeof model !== 'object' ||
    !Array.isArray(model.paramValues) ||
    !Array.isArray(model.colors)
  ) {
    return false
  }

  return model.paramValues.every((paramValue: ParamValue) => {
    const param = params.find(param => param.id === paramValue.paramId)
    return (
      param && param.type === 'string' && typeof paramValue.value === 'string'
    )
  })
}

const ParamInputField = ({
  param,
  value,
  onChange,
}: {
  param: Param
  value: string
  onChange: (value: string) => void
}) => {
  switch (param.type) {
    case 'string':
      return (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )
    default:
      console.error(`Текущий тип параметра не предусмотрен: ${param.type}`)
      return null
  }
}

export const ParamEditor = ({ params, model }: Props) => {
  if (!params.length) return <p>Нет доступных параметров</p>
  if (!isValidModel(model, params)) return <p>Некорректная модель</p>

  const [paramValues, setParamValues] = useState<ParamValue[]>(
    model.paramValues,
  )

  useEffect(() => {
    setParamValues(model.paramValues)
  }, [model.paramValues])

  const handleChangeValue = (paramId: number, newValue: string) => {
    setParamValues(prev =>
      prev.map(paramValue =>
        paramValue.paramId === paramId
          ? { ...paramValue, value: newValue }
          : paramValue,
      ),
    )
  }

  const getModel = (): Model => ({
    paramValues: paramValues,
    colors: model.colors,
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Редактор параметров</h2>

      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'min-content min-content',
          gap: '4px',
          marginBottom: '8px',
        }}
      >
        {params.map(param => {
          const value =
            paramValues.find(paramValue => paramValue.paramId === param.id)
              ?.value || ''
          return (
            <Fragment key={param.id}>
              <label style={{ textAlign: 'center' }}>{param.name}</label>

              <ParamInputField
                param={param}
                value={value}
                onChange={newValue => handleChangeValue(param.id, newValue)}
              />
            </Fragment>
          )
        })}
      </ul>

      <button onClick={() => console.log(getModel())}>
        Вывести модель в консоль
      </button>
    </div>
  )
}
