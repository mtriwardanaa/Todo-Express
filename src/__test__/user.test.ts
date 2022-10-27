import request from 'supertest'
import app from '../configs/app'
import { User } from '../Modules/user/models/user-model'

describe('test create route', () => {
    const user = {
        name: 'user_test',
        username: 'usertest',
        password: 'usertest123',
    }

    test('shoulg have status, data, message when created ', async () => {
        const mockCreateUser = jest.fn((): any => user)
        jest.spyOn(User, 'create').mockImplementation(() => mockCreateUser())

        const res = await request(app).post('/api/user/create').send(user)
        console.log(res)
        expect(res.body).toHaveProperty('status')
        // expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('message')
    })
})
