import { object, string, number, TypeOf } from "zod";

// 'part' of the schema - body is an object containing a game id which is a string.
// this is required. 
const payload = {
    // all the stuff needed for creating/modifying a game - its fields
    body: object({
        playerOneId: string({
            required_error: "player2 Id required.",
        }),
        playerTwoId: string({
            required_error: "player2 Id required."
        }),
        firstPlayer: string({
            required_error: "first player required."
        }),
        boardsize: number({
            required_error: "board size required."
        })
    }),
}

const getParams = {
    params: object({
        gameId: string({
            required_error: "game Id required.",
        })
    })
}

const updateDeleteParams = {
    params: object({
        gameId: string({
            required_error: "game Id required.",
        })
    })
}

// export const createBookingSchema = object({
//    ...payload
// });

// export const deleteBookingSchema = object({
//    ...updateDeleteParams
// })

export const getGamesSchema = object({
    // nothing required
})

// this one allows to create the type is typescript based on the above
// definitions so you onyl have to define it once
// export type CreateGameSchemaInput = TypeOf<typeof createGameSchema>;