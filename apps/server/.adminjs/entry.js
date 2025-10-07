AdminJS.UserComponents = {}
AdminJS.env.NODE_ENV = "development"
import Dashboard from '../src/routes/admin/client/components/Dashboard/Dashboard'
AdminJS.UserComponents.Dashboard = Dashboard
import ListRecordLinkProperty from '../src/routes/admin/client/components/ListProperty/ListRecordLinkProperty'
AdminJS.UserComponents.ListRecordLinkProperty = ListRecordLinkProperty
import EditPasswordProperty from '../src/routes/admin/client/components/EditProperty/EditPasswordProperty'
AdminJS.UserComponents.EditPasswordProperty = EditPasswordProperty
import DifferenceRecordProperty from '../src/routes/admin/client/components/DifferenceProperty/DifferenceRecordProperty'
AdminJS.UserComponents.DifferenceRecordProperty = DifferenceRecordProperty
import Login from '../src/routes/admin/client/components/Login/Login'
AdminJS.UserComponents.Login = Login
import RecordDifference from '../../../node_modules/@adminjs/logger/lib/components/RecordDifference'
AdminJS.UserComponents.RecordDifference = RecordDifference
import RecordLink from '../../../node_modules/@adminjs/logger/lib/components/RecordLink'
AdminJS.UserComponents.RecordLink = RecordLink
import PasswordEditComponent from '../../../node_modules/@adminjs/passwords/build/components/PasswordEditComponent'
AdminJS.UserComponents.PasswordEditComponent = PasswordEditComponent
import ImportComponent from '../../../node_modules/@adminjs/import-export/lib/components/ImportComponent'
AdminJS.UserComponents.ImportComponent = ImportComponent
import ExportComponent from '../../../node_modules/@adminjs/import-export/lib/components/ExportComponent'
AdminJS.UserComponents.ExportComponent = ExportComponent