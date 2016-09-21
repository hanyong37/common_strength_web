# 接口文档

* cs 项目接口文档整理

> /cours/getCoursesInfo `get`

```
{
  currentPage
  pageSize
  keyword
}
```
> /cours/insertCourseInfo  ` `

```
{
  courseId
  courseName
  typeId
  courseStatus
  storeId
  courseDescription
}
```
> /cours/updateCourseInfo  ` `

```
{
  courseId
  courseName
  typeId
  courseStatus
  storeId
  courseDescription
}
```
> /cours/deleteCourseInfo  ` `

```
{
  courseId
}
```
> /rule/setCourseRule  `post`

```
{
  viewCourseDays
  reservationCourseDays
  cancelCourseDatetime
  allowLineDatetime
  resevationDeadline
}
```
> /schedule/getCourseSchedulesByStoreId  `get`

```
{
  storeId
  startTime
  endTime
}
```
> /schedule/deleteCourseScheduleByScheduleIdAndCourseId  `get`

```
{
  scheduleId
  courseId
}
```
> /schedule/insertCourseSchedule  `get`

```
{
  scheduleId
  courseId
  startTime
  endTime
  capacity
}
```
> /courseType/getCourseTypeInfo  `get`

```
{
  currentPage
  pageSize
  keyword
}
```
> /courseType/insertCourseTypeInfo  `get`

```
{
  typeId
  typeName
}
```
> /courseType/updateCourseTypeInfo  `get`

```
{
  typeId
  typeName
}
```
> /courseType/deleteCourseTypeInfo  `get`

```
{
  typeId
}
```
> /member/getMemberShipsInfo  `get`

```
{
  currentPage
  pageSize
  keyword
}
```
> /member/getMemberShipsInfoMembershipId  `get`

```
{
  memberShipId
}
```
> /member/insertMemberShipsInfo  `get`

```
{
  memberShipId
  memberShipName
  memberShipTelephoen
  memberShipWechatId
  memberShipCardType
  deadLine
  residueDegree
  storteId
}
```
> /member/updateMemberShipsInfo  `get`

```
{
  memberShipId
  memberShipName
  memberShipTelephoen
  memberShipWechatId
  memberShipCardType
  deadLine
  residueDegree
  storteId
}
```
> /member/getCardOperationsInfo  `get`

```
{
  memberShipId
  currentPage
  pageSize
  keyword
}
```
> /store/insertCourseInfo  `post`

```
{
  storeId
  storeName
  storeAddress
  storeDescription
}
```
> /store/updateStoreInfo  `post`

```
{
  storeId
  storeName
  storeAddress
  storeDescription
}
```
> /store/deleteStoreInfoByStoreId  `get`

```
{
  storeId
}
```
> /store/getStoreInfoByStoreId  `get`

```
{
  storeId
}
```
> /store/getStoresInfo  `get`

```
{
  currentPage
  pageSize
  keyword
}
```
> /user/getUser  `post`

```
{
  userName
  password
}
```
