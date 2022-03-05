using Microsoft.EntityFrameworkCore.Migrations;

namespace DeviceManagementSystem.Migrations
{
    public partial class doubleramamount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "RamAmmount",
                table: "DeviceDetails",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RamAmmount",
                table: "DeviceDetails",
                nullable: true,
                oldClrType: typeof(double));
        }
    }
}
