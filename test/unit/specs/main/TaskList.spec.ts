// tslint:disable-next-line: no-reference
/// <reference path="../../../../src/types/common.d.ts" />

import { expect } from 'chai'
import * as _ from 'lodash'
import TaskList from '../../../../src/main/TaskList'

describe('TaskList', () => {
  it('returns tasks that include explorer.exe', (done) => {
    TaskList.get().then((result) => {
      try {
        // tslint:disable-next-line: no-unused-expression
        expect(_.some(result, { name: 'explorer.exe' })).to.be.true
      } catch (e) {
        return done(e)
      }
      done()
    }).catch(() => {
      done(new Error('rejected'))
    })
  })
})
